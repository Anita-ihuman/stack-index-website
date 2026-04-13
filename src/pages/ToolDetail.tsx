import { useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { ToolMetadataPanel } from '@/components/ToolMetadataPanel';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { ScoringTable } from '@/components/ScoringTable';
import { AIAnalysisContainer } from '@/components/AIAnalysisContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { catalogApi } from '@/lib/apiClient';
import { ChevronLeft, CheckCircle2, XCircle, Zap, ExternalLink, BookOpen, GitCompare } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  'container-orchestration': 'Container & Orchestration',
  'cicd': 'CI/CD',
  'observability': 'Observability',
  'infrastructure-as-code': 'IaC',
  'service-mesh-networking': 'Service Mesh',
  'databases': 'Databases',
  'message-queue': 'Message Queue',
  'frontend-frameworks': 'Frontend',
  'backend-frameworks': 'Backend',
  'security': 'Security',
  'data-analytics': 'Data & Analytics',
  'developer-tools': 'Dev Tools',
};

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const aiSectionRef = useRef<HTMLDivElement>(null);

  // AI Insights state — undefined = not yet triggered
  const [aiInput, setAiInput] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tool', slug],
    queryFn: () => catalogApi.getTool(slug!, true),
    enabled: !!slug,
  });

  const tool = data?.tool;
  const score = data?.score;

  const triggerAI = (input: string) => {
    setAiInput(input);
    // Small delay so the component renders before we scroll to it
    setTimeout(() => {
      aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-10 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-2/3" />
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-10">
          <p className="text-muted-foreground">Tool not found.</p>
          <Button variant="outline" onClick={() => navigate('/tools')} className="mt-4">
            Back to Catalog
          </Button>
        </main>
      </div>
    );
  }

  const scoreTable = score && score.overall > 0
    ? {
        tools: [{
          name: tool.name,
          slug: tool.slug,
          dimensions: {
            'GitHub Stars': { score: score.dimensions.githubStars.normalized, confidence: score.dimensions.githubStars.confidence },
            'Contributor Velocity': { score: score.dimensions.contributorVelocity.normalized, confidence: score.dimensions.contributorVelocity.confidence },
            'Issue Resolution': { score: score.dimensions.issueResolutionSpeed.normalized, confidence: score.dimensions.issueResolutionSpeed.confidence },
            'Documentation': { score: score.dimensions.documentationQuality.normalized, confidence: score.dimensions.documentationQuality.confidence },
            'Download Volume': { score: score.dimensions.downloadVolume.normalized, confidence: score.dimensions.downloadVolume.confidence },
            'Community Activity': { score: score.dimensions.communityActivity.normalized, confidence: score.dimensions.communityActivity.confidence },
            'Enterprise Adoption': { score: score.dimensions.enterpriseAdoption.normalized, confidence: score.dimensions.enterpriseAdoption.confidence },
            'Maintenance Health': { score: score.dimensions.maintenanceHealth.normalized, confidence: score.dimensions.maintenanceHealth.confidence },
          },
          totalScore: score.overall,
        }],
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${tool.name} — DevOps Tool Overview`}
        description={tool.description}
        path={`/tools/${tool.slug}`}
      />
      <Header />

      <main className="container py-10 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/tools" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Tool Catalog
          </Link>
          <span>/</span>
          <span className="text-foreground font-mono">{tool.name}</span>
        </div>

        {/* Hero */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-4xl font-bold font-mono">{tool.name}</h1>
            {score && score.overall > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <ConfidenceBadge confidence={score.dataConfidence} size="md" />
                <span className="text-2xl font-mono font-bold text-primary">{score.overall}/100</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{CATEGORY_LABELS[tool.category] ?? tool.category}</Badge>
            <Badge variant="outline" className="capitalize">{tool.maturityLevel}</Badge>
            <Badge variant="outline" className="capitalize">{tool.pricingModel}</Badge>
            <Badge variant="outline" className="capitalize">{tool.deploymentModel}</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{tool.description}</p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild variant="outline" size="sm">
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Website
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Documentation
              </a>
            </Button>
            <Button
              size="sm"
              onClick={() => triggerAI(tool.name)}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              AI Insights
            </Button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-6">
            {/* Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Core Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                  {tool.coreArchitectureModel}
                </p>
              </CardContent>
            </Card>

            {/* Best Fit / Not Ideal */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-emerald-600 dark:text-emerald-400">
                    Best Fit For
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5">
                    {tool.bestFitFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-600 dark:text-red-400">
                    Not Ideal For
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5">
                    {tool.notIdealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Primary Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Primary Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tool.primaryUseCases.map((useCase, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scalability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scalability Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.scalabilityProfile}</p>
              </CardContent>
            </Card>

            {/* Ecosystem */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ecosystem Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.ecosystemStrength}</p>
              </CardContent>
            </Card>

            {/* Scoring Table */}
            {score && score.overall > 0 && scoreTable && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Live Scoring</h3>
                  <ConfidenceBadge confidence={score.dataConfidence} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">Overall Score</span>
                  <Progress value={score.overall} className="h-2 flex-1" />
                  <span className="text-sm font-mono font-bold w-12 text-right">
                    {score.overall}/100
                  </span>
                </div>
                <ScoringTable scoringTable={scoreTable} />
              </div>
            )}

            {/* Alternatives */}
            {tool.alternatives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alternatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.alternatives.map((alt) => (
                      <div key={alt} className="flex gap-1">
                        <Link to={`/tools/${alt}`}>
                          <Badge
                            variant="outline"
                            className="font-mono cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            {alt}
                          </Badge>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={() => triggerAI(`${tool.name} vs ${alt}`)}
                        >
                          compare
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── AI Insights ─────────────────────────────────────────────── */}
            <div ref={aiSectionRef} className="scroll-mt-24">
              <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
                {/* Section header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">AI Insights</span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">
                      Powered by live docs
                    </span>
                  </div>
                  {aiInput && (
                    <button
                      onClick={() => setAiInput(undefined)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      clear
                    </button>
                  )}
                </div>

                {/* Quick actions — always visible */}
                <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-border">
                  <Button
                    size="sm"
                    variant={aiInput === tool.name ? 'default' : 'outline'}
                    className="gap-1.5 text-xs"
                    onClick={() => triggerAI(tool.name)}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Deep-dive: {tool.name}
                  </Button>
                  {tool.alternatives.slice(0, 4).map((alt) => (
                    <Button
                      key={alt}
                      size="sm"
                      variant={aiInput === `${tool.name} vs ${alt}` ? 'default' : 'outline'}
                      className="gap-1.5 text-xs"
                      onClick={() => triggerAI(`${tool.name} vs ${alt}`)}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      vs {alt}
                    </Button>
                  ))}
                </div>

                {/* Analysis result — only rendered when triggered */}
                {aiInput ? (
                  <div className="px-6 py-6">
                    <AIAnalysisContainer
                      key={aiInput}
                      initialInput={aiInput}
                      compact
                    />
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Select an action above to get AI-powered insights from {tool.name}'s live documentation.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* ── /AI Insights ─────────────────────────────────────────────── */}

          </div>

          {/* Sidebar */}
          <aside>
            <ToolMetadataPanel tool={tool} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
