import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPostBySlug } from "@/lib/posts";
import { Share2, Twitter, Linkedin, Link2, Check, MessageSquare, ArrowRight, Facebook, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; name: string; body: string; created: string }>>([]);
  const [commentForm, setCommentForm] = useState({ name: "", body: "" });
  // use direct marked renderer

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug).then((post) => {
      if (!post) {
        setContent(null);
        setMeta(null);
      } else {
        setMeta(post.meta);
        setContent(post.content);
        // load comments from localStorage
        try {
          const key = `post:${slug}:comments`;
          const raw = localStorage.getItem(key);
          if (raw) setComments(JSON.parse(raw));
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    });
  }, [slug]);

  // persist comments when they change
  useEffect(() => {
    if (!slug) return;
    try {
      localStorage.setItem(`post:${slug}:comments`, JSON.stringify(comments));
    } catch (e) {
      // ignore
    }
  }, [comments, slug]);

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
    <div className="min-h-screen bg-background">
      {meta && (
        <SEO
          title={meta.title}
          description={meta.description || `${meta.title} — Stack Index Blog`}
          path={`/blog/${meta.slug}`}
          image={meta.thumbnail ? `https://stackindex.io${meta.thumbnail}` : undefined}
          type="article"
          publishedDate={meta.date}
          author={meta.author}
        />
      )}
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          {meta && (
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{meta.title}</h1>
              <p className="text-sm text-muted-foreground">By {meta.author} — {meta.date}</p>
              {/* Share bar */}
              <div className="mt-4 flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(window.location.href)}&via=TheStackIndex`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Twitter className="w-4 h-4" />
                        Share on Twitter
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Linkedin className="w-4 h-4" />
                        Share on LinkedIn
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Facebook className="w-4 h-4" />
                        Share on Facebook
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(meta.title)}&body=${encodeURIComponent(`I thought you'd find this interesting: ${window.location.href}`)}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        Share via Email
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {comments.length > 0 ? `${comments.length} comments` : 'Leave a comment'}
                </button>
              </div>
            </header>
          )}

          <article className="prose max-w-none bg-card p-6 rounded border-border" dangerouslySetInnerHTML={{ __html: marked(String(content)) }} />

          {/* Related Tools */}
          {meta?.relatedTools && meta.relatedTools.length > 0 && (
            <div className="mt-8 p-6 rounded-lg border border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-4">Tools mentioned in this post</h3>
              <div className="flex flex-wrap gap-3">
                {meta.relatedTools.map((toolSlug: string) => (
                  <Link
                    key={toolSlug}
                    to={`/tools/${toolSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary/60 transition-colors"
                  >
                    {toolSlug.replace(/-/g, ' ')}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

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
