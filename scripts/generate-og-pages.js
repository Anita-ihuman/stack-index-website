#!/usr/bin/env node

/**
 * Generate static OG HTML pages for each blog post.
 * Reads markdown frontmatter and creates redirect pages with proper meta tags.
 * Output: public/blog/:slug/index.html with og:image, og:title, og:description
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.stackindex.io';
const postsDir = path.join(__dirname, '../src/content/posts');
const outputDir = path.join(__dirname, '../public/blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all markdown posts
const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log(`[OG Generator] Found ${postFiles.length} posts. Generating OG pages...`);

postFiles.forEach(file => {
  const slug = file.replace('.md', '');
  const filePath = path.join(postsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);

  const title = data.title || 'Stack Index';
  const desc = data.description || data.excerpt || '';
  const thumbnail = data.thumbnail || '/og-image.png';
  
  // Ensure thumbnail is an absolute URL
  const image = thumbnail.startsWith('http')
    ? thumbnail
    : `${SITE_URL}${thumbnail}`;
  
  const url = `${SITE_URL}/blog/${slug}`;

  // Generate HTML with OG meta tags
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(desc)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(desc)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>
  <script>window.location.replace("${escapeHtml(url)}");</script>
  <p>Redirecting to article…</p>
</body>
</html>`;

  // Create slug-specific directory
  const slugDir = path.join(outputDir, slug);
  if (!fs.existsSync(slugDir)) {
    fs.mkdirSync(slugDir, { recursive: true });
  }

  // Write index.html
  fs.writeFileSync(path.join(slugDir, 'index.html'), html);
  console.log(`  ✓ ${slug}/index.html`);
});

console.log(`[OG Generator] Done! Generated ${postFiles.length} OG pages in ${outputDir}`);

// Helper to escape HTML entities
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}
