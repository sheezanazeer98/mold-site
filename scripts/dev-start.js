/**
 * Starts both the local dev server and the Decap CMS proxy in parallel.
 * - Site server: http://localhost:3000
 * - CMS proxy:   http://localhost:8081 (used by Decap CMS local_backend)
 */
const { spawn } = require('child_process');

const siteServer = spawn('node', ['scripts/dev-server.js'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

const cmsProxy = spawn('npx', ['decap-server'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

process.on('SIGINT', function () {
  siteServer.kill();
  cmsProxy.kill();
  process.exit();
});

process.on('SIGTERM', function () {
  siteServer.kill();
  cmsProxy.kill();
  process.exit();
});
