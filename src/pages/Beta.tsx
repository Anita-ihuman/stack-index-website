import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { newsletterApi } from '@/lib/apiClient';
import { CheckCircle2, Sparkles, Search, BarChart3, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'AI-Powered Tool Search',
    description: 'Ask in plain English — "best observability for Kubernetes on a budget" — and get ranked, reasoned recommendations.',
  },
  {
    icon: BarChart3,
    title: 'Scored Across 8 Dimensions',
    description: 'Every tool is evaluated on adoption, community, docs quality, maturity, pricing, and more — not just star count.',
  },
  {
    icon: Sparkles,
    title: 'Live Doc Intelligence',
    description: 'The AI Analyzer reads live documentation and surfaces insights, tradeoffs, and comparisons you can actually trust.',
  },
  {
    icon: BookOpen,
    title: '57+ Tools Indexed',
    description: 'CI/CD, IaC, observability, service mesh, security, databases — the full DevOps stack in one place.',
  },
];

export default function Beta() {
  const [form, setForm] = useState({ firstName: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setStatus('loading');
    try {
      await newsletterApi.subscribe({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        source: 'beta-waitlist',
      });
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Join the Beta"
        description="Stack Index is the AI-native platform that helps you discover, compare, and confidently adopt DevOps tools. Join the waitlist to get early access."
        path="/beta"
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="container py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="font-mono text-xs px-3 py-1">
              Early Access · Limited Spots
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold font-mono leading-tight">
              The intelligence layer<br />
              <span className="text-primary">DevOps teams have been missing.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Stack Index bridges the gap between discovering a tool and confidently adopting it —
              with AI-powered analysis, live documentation insights, and scored comparisons across
              the tools that run modern infrastructure.
            </p>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">You're on the list!</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  We'll email you the moment Stack Index opens to the public. In the meantime,
                  check out our blog for DevRel insights and tool deep-dives.
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-primary hover:underline"
                >
                  Read the blog <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                  className="sm:w-36 shrink-0"
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  className="flex-1"
                />
                <Button type="submit" disabled={status === 'loading'} className="shrink-0">
                  {status === 'loading' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining…</>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <p className="text-xs text-muted-foreground">
              No spam. Unsubscribe any time. We'll only email you when it matters.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/60 bg-card/40">
          <div className="container py-16">
            <h2 className="text-center text-sm font-mono uppercase tracking-widest text-muted-foreground mb-10">
              What you'll get access to
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-5 rounded-lg border border-border bg-card space-y-3">
                  <f.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof / mission */}
        <section className="container py-16">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Built by a developer advocate who has spent years watching engineers lose hours
              evaluating tools with no reliable signal — just GitHub stars and blog posts from
              vendors. Stack Index is the platform we wish existed.
            </p>
            <p className="text-sm font-mono text-primary">— Anita Ihuman, Founder</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
