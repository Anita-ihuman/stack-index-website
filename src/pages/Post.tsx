import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPostBySlug } from "@/lib/posts";
import { ThumbsUp, Heart, Star, MessageSquare } from "lucide-react";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  // reactions stored per-slug in localStorage: { counts: {like: number, love: number, clap: number}, voted: {like:boolean,...} }
  const [reactions, setReactions] = useState<{ like: number; love: number; clap: number; voted: { like: boolean; love: boolean; clap: boolean } }>({
    like: 0,
    love: 0,
    clap: 0,
    voted: { like: false, love: false, clap: false },
  });

  const [comments, setComments] = useState<Array<{ id: string; name: string; body: string; created: string }>>([]);
  const [commentForm, setCommentForm] = useState({ name: "", body: "" });
  // use direct marked renderer

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug).then((post) => {
      console.log('[Post] getPostBySlug result for', slug, post);
      if (!post) {
        setContent(null);
        setMeta(null);
      } else {
        setMeta(post.meta);
        setContent(post.content);
        // load reactions and comments from localStorage
        try {
          const key = `post:${slug}:meta`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.reactions) setReactions(parsed.reactions);
            if (parsed.comments) setComments(parsed.comments);
          }
        } catch (e) {
          console.debug('[Post] failed to load local reactions/comments', e);
        }
      }
      setLoading(false);
    });
  }, [slug]);

  // persist reactions/comments when they change
  useEffect(() => {
    if (!slug) return;
    try {
      const key = `post:${slug}:meta`;
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.reactions = reactions;
      parsed.comments = comments;
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch (e) {
      console.debug('[Post] failed to persist reactions/comments', e);
    }
  }, [reactions, comments, slug]);

  if (loading) return <div className="min-h-screen">Loading…</div>;
  if (!content) return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-24">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="mt-4">Try browsing the <Link to="/blog" className="text-primary">blog index</Link>.</p>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          {meta && (
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{meta.title}</h1>
              <p className="text-sm text-muted-foreground">By {meta.author} — {meta.date}</p>
              {/* Reactions and comments bar */}
              <div className="mt-4 flex items-center gap-4">
                <button
                  aria-pressed={reactions.voted.like}
                  onClick={() => {
                    if (reactions.voted.like) return;
                    setReactions((r) => ({ ...r, like: r.like + 1, voted: { ...r.voted, like: true } }));
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-background hover:bg-gray-50"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{reactions.like}</span>
                </button>

                <button
                  aria-pressed={reactions.voted.love}
                  onClick={() => {
                    if (reactions.voted.love) return;
                    setReactions((r) => ({ ...r, love: r.love + 1, voted: { ...r.voted, love: true } }));
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-background hover:bg-gray-50"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">{reactions.love}</span>
                </button>

                <button
                  aria-pressed={reactions.voted.clap}
                  onClick={() => {
                    if (reactions.voted.clap) return;
                    setReactions((r) => ({ ...r, clap: r.clap + 1, voted: { ...r.voted, clap: true } }));
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-background hover:bg-gray-50"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{reactions.clap}</span>
                </button>

                <button
                  onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-background hover:bg-gray-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{comments.length}</span>
                </button>
              </div>
            </header>
          )}

          <article className="prose max-w-none bg-card p-6 rounded border-border" dangerouslySetInnerHTML={{ __html: marked(String(content)) }} />

          {/* Comments section (simple, client-side) */}
          <div ref={commentsRef} className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            <div className="space-y-4 mb-6">
              {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet — be the first to share your thoughts.</p>}
              {comments.map((c) => (
                <div key={c.id} className="p-3 border rounded bg-muted">
                  <div className="flex items-center justify-between">
                    <strong>{c.name || 'Anonymous'}</strong>
                    <span className="text-xs text-muted-foreground">{new Date(c.created).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm">{c.body}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!commentForm.body.trim()) return;
                const newC = { id: String(Date.now()), name: commentForm.name.trim() || 'Anonymous', body: commentForm.body.trim(), created: new Date().toISOString() };
                setComments((s) => [newC, ...s]);
                setCommentForm({ name: '', body: '' });
                // scroll to top of comments to show the new one
                commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="space-y-2"
            >
              <input
                value={commentForm.name}
                onChange={(e) => setCommentForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your name (optional)"
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                value={commentForm.body}
                onChange={(e) => setCommentForm((s) => ({ ...s, body: e.target.value }))}
                placeholder="Write a thoughtful comment"
                className="w-full px-3 py-2 border rounded h-24"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">Post comment</button>
                <button type="button" onClick={() => { setCommentForm({ name: '', body: '' }); }} className="btn">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Post;
