type PostMeta = {
  title: string;
  date?: string;
  tag?: string;
  author?: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  relatedTools?: string[]; // comma-separated tool slugs in frontmatter e.g. "kubernetes,helm"
};

type Post = {
  meta: PostMeta;
  content: string;
};

const eagerModules = import.meta.glob('/src/content/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

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
    // parse comma-separated relatedTools into an array
    if (key === 'relatedTools') {
      meta[key] = val.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      meta[key] = val;
    }
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
  results.sort((a, b) => {
    if (a.meta.date && b.meta.date) return b.meta.date.localeCompare(a.meta.date);
    return 0;
  });
  return results;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  const slugNorm = String(slug || '').trim().toLowerCase();
  const found = posts.find((p) => String(p.meta.slug || '').trim().toLowerCase() === slugNorm);
  return found ?? null;
};

export type { Post, PostMeta };
