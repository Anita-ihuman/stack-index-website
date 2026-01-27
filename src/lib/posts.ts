type PostMeta = {
  title: string;
  date?: string;
  tag?: string;
  author?: string;
  description?: string;
  slug: string;
};

type Post = {
  meta: PostMeta;
  content: string;
};

// Load all markdown files from src/content/posts as raw text.
// Use an eager glob with `as: 'raw'` so files are loaded at module init and available in dev/hmr.
// This avoids resolver functions and makes debugging simpler.
const eagerModules = import.meta.glob('/src/content/posts/*.md', { as: 'raw', eager: true }) as Record<string, string>;

// Debug: show which file keys matched the glob
try {
  console.log('[posts] glob keys:', Object.keys(eagerModules));
} catch (e) {}

const parseFrontmatter = (raw: string) => {
  const fmMatch = raw.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!fmMatch) return { meta: {} as any, body: raw };
  const fm = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);
  const lines = fm.split(/\r?\n/);
  const meta: any = {};
  for (const line of lines) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let val = line.slice(sep + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    meta[key] = val;
  }
  return { meta, body };
};

export const getAllPosts = async (): Promise<Post[]> => {
  // `eagerModules` contains raw file contents when using eager: true
  const entries = Object.entries(eagerModules as Record<string, string>);
  const results: Post[] = [];
  for (const [path, raw] of entries) {
    try {
      const { meta, body } = parseFrontmatter(raw as string);
      // path may include query strings (e.g. '?raw') when using the '?raw' glob.
      // Ensure we strip any query and the .md extension to form a clean slug.
      const filename = path.split('/').pop() || '';
      const cleanFilename = filename.split('?')[0];
      const filenameSlug = cleanFilename.replace(/\.md$/, '');
      // prefer slug from frontmatter when present, otherwise use filename
      let finalSlug = (meta && (meta as any).slug) ? (meta as any).slug : filenameSlug;
      // normalize slug: trim and lowercase to avoid mismatches
      finalSlug = String(finalSlug).trim().toLowerCase();
      results.push({ meta: { ...(meta as any), slug: finalSlug }, content: body });
    } catch (e) {
      // ignore
    }
  }
  // sort by date descending if available
  results.sort((a, b) => {
    if (a.meta.date && b.meta.date) return b.meta.date.localeCompare(a.meta.date);
    return 0;
  });
  // DEBUG: temporary log to show what posts were discovered by the loader
  try {
    console.log("[posts] loaded", results.length, "posts ->", results.map(r => ({ slug: r.meta.slug, title: r.meta.title })));
  } catch (e) {
    // ignore logging errors in environments without console
  }
  return results;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  const slugNorm = String(slug || '').trim().toLowerCase();
  try {
    console.log('[getPostBySlug] looking for slug=', slugNorm, 'available posts=', posts.map(p => p.meta.slug));
  } catch (e) {}
  const found = posts.find((p) => String(p.meta.slug || '').trim().toLowerCase() === slugNorm);
  try { console.log('[getPostBySlug] found=', !!found); } catch (e) {}
  return found ?? null;
};

export type { Post, PostMeta };
