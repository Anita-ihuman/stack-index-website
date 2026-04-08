import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { env } from '../config/environment';

const router = Router();

// Posts are in the frontend src/content/posts directory
const postsDir = path.resolve(__dirname, '../../../src/content/posts');

router.get('/:slug', (req: Request, res: Response): void => {
  const slug = req.params.slug;
  const file = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(file)) {
    res.status(404).send('Post not found');
    return;
  }

  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);

  const title = data.title || 'Stack Index';
  const desc = data.description || data.excerpt || '';
  const image = (data.thumbnail && data.thumbnail.startsWith('http'))
    ? data.thumbnail
    : `${env.SITE_URL}${data.thumbnail || '/og-image.png'}`;
  const url = `${env.SITE_URL}/blog/${slug}`;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />
</head>
<body>
  <script>window.location.replace("${url}");</script>
  <p>Redirecting to article…</p>
</body>
</html>`;

  res.set('Content-Type', 'text/html');
  res.send(html);
});

export default router;