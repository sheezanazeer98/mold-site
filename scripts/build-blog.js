/**
 * Build script — Generates /data/posts.json from /content/blog/*.md files.
 * Runs during Netlify build (npm run build:blog).
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'posts.json');

function buildPostsIndex() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('[build-blog] No blog directory found. Creating empty posts.json');
    writeOutput([]);
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(function (filename) {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    // Always use filename as slug — this is what exists on disk and what blog-post.js fetches
    const slug = filename.replace(/\.md$/, '');

    const plainText = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*|__/g, '')
      .replace(/\*|_/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/>\s?/g, '')
      .replace(/[-*+]\s/g, '')
      .replace(/\d+\.\s/g, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();

    const excerpt = data.excerpt || data.description || plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');

    return {
      title: data.title || slug,
      slug: slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: excerpt,
      image: data.image || data.thumbnail || '',
      tags: data.tags || [],
    };
  });

  posts.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  writeOutput(posts);
  console.log('[build-blog] Generated posts.json with ' + posts.length + ' posts.');
}

function writeOutput(data) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
}

buildPostsIndex();
