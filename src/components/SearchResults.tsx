import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ArrowRight, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';
import type { SearchResponse } from '@/types/catalog';

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

const INTENT_LABELS: Record<string, string> = {
  find_tool: 'Find Tool',
  compare_tools: 'Compare Tools',
  browse_category: 'Browse Category',
  get_recommendation: 'Recommendation',
};

interface SearchResultsProps {
  response: SearchResponse;
  allTools?: import('@/types/catalog').ToolCatalogEntry[];
}

export function SearchResults({ response, allTools = [] }: SearchResultsProps) {
  const { query, intent, results, summary } = response;

  const toolMap = new Map(allTools.map((t) => [t.slug, t]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">Results for "{query}"</h3>
            <Badge variant="secondary" className="text-[10px]">
              {INTENT_LABELS[intent] ?? intent}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {results.length} match{results.length !== 1 ? 'es' : ''}
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">{summary}</p>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No tools found. Try a different query.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((result) => {
            const tool = toolMap.get(result.toolSlug);

            return (
              <Link
                key={result.toolSlug}
                to={`/tools/${result.toolSlug}`}
                className="group block"
              >
                <div className="h-full rounded-lg border border-border hover:border-primary/50 bg-card hover:shadow-md transition-all duration-200 p-4 flex flex-col gap-3">

                  {/* Tool header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        #{result.rank}
                      </span>
                      <span className="font-mono font-bold text-sm truncate">
                        {result.toolName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-mono font-bold text-primary">
                        {result.relevanceScore}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Badges */}
                  {tool && (
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {CATEGORY_LABELS[tool.category] ?? tool.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal capitalize"
                      >
                        {tool.maturityLevel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal capitalize"
                      >
                        {tool.pricingModel}
                      </Badge>
                    </div>
                  )}

                  {/* Description */}
                  {tool && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  )}

                  {/* AI match reason */}
                  <div className="flex items-start gap-1.5 bg-primary/5 rounded-md px-2.5 py-2">
                    <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">
                      {result.matchReason}
                    </p>
                  </div>

                  {/* Tradeoff warning */}
                  {result.tradeoffs && (
                    <div className="flex items-start gap-1.5 bg-amber-500/5 rounded-md px-2.5 py-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                        {result.tradeoffs}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <ConfidenceBadge confidence={result.dataConfidence} size="sm" />
                    {tool && (
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
