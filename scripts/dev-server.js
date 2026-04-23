/**
 * Local dev server with SPA fallback routing and request logging.
 * All non-file routes serve /index.html for client-side routing.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

function getMime(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function serveFile(res, filePath, status) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      log(404, filePath);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 — Not Found</h1>');
      return;
    }
    var mime = getMime(filePath);
    log(status || 200, filePath);
    res.writeHead(status || 200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
}

function log(status, detail) {
  var color = status === 200 ? '\x1b[32m' : status === 301 ? '\x1b[33m' : '\x1b[31m';
  console.log(color + status + '\x1b[0m ' + detail);
}

function tryFile(filePath, callback) {
  fs.stat(filePath, function (err, stats) {
    callback(!err && stats && stats.isFile());
  });
}

var SPA_INDEX = path.join(ROOT, 'index.html');

var server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0];

  try { url = decodeURIComponent(url); } catch (e) { /* ignore */ }

  console.log('\x1b[36m' + req.method + '\x1b[0m ' + req.url);

  // Admin directory — serve directly (bypass SPA)
  if (url.startsWith('/admin')) {
    if (url === '/admin') {
      res.writeHead(301, { 'Location': '/admin/' });
      res.end();
      return;
    }
    var adminPath = path.join(ROOT, url.endsWith('/') ? url + 'index.html' : url);
    if (adminPath.startsWith(ROOT)) {
      serveFile(res, adminPath);
    }
    return;
  }

  // Add index.html for root path
  if (url === '/') {
    serveFile(res, SPA_INDEX);
    return;
  }

  var filePath = path.join(ROOT, url);

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 1. Try exact file path (serves CSS, JS, images, JSON, markdown, etc.)
  tryFile(filePath, function (exists) {
    if (exists) {
      serveFile(res, filePath);
      return;
    }

    // 2. If it's a directory, check for index.html inside it
    var ext = path.extname(filePath);
    if (!ext) {
      var dirIndex = path.join(filePath, 'index.html');
      tryFile(dirIndex, function (indexExists) {
        if (indexExists) {
          serveFile(res, dirIndex);
          return;
        }

        // 3. SPA fallback — serve index.html for all unmatched routes
        log(200, url + ' -> SPA fallback');
        serveFile(res, SPA_INDEX, 200);
      });
    } else {
      // Has extension but file not found
      log(404, url);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 — Not Found</h1><p>' + url + '</p>');
    }
  });
});

server.listen(PORT, function () {
  console.log('\n  \x1b[1mClearMend — SPA Dev Server\x1b[0m\n');
  console.log('  Site:  \x1b[36mhttp://localhost:' + PORT + '\x1b[0m');
  console.log('  Admin: \x1b[36mhttp://localhost:' + PORT + '/admin/\x1b[0m\n');
});
