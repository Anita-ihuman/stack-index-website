import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ArrowRight } from 'lucide-react';
import type { SearchResponse } from '@/types/catalog';

interface SearchResultsProps {
  response: SearchResponse;
}

export function SearchResults({ response }: SearchResultsProps) {
  const { query, intent, results, summary } = response;

  const intentLabel: Record<string, string> = {
    find_tool: 'Find Tool',
    compare_tools: 'Compare Tools',
    browse_category: 'Browse Category',
    get_recommendation: 'Recommendation',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">Results for "{query}"</h3>
            <Badge variant="secondary" className="text-[10px]">
              {intentLabel[intent] ?? intent}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {results.length} match{results.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No tools found. Try a different query.</p>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <Link key={result.toolSlug} to={`/tools/${result.toolSlug}`} className="group block">
              <Card className="border border-border hover:border-primary/40 transition-all">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        #{result.rank}
                      </span>
                      <CardTitle className="text-sm font-mono truncate">{result.toolName}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ConfidenceBadge confidence={result.dataConfidence} />
                      <span className="text-xs font-mono text-primary">
                        {result.relevanceScore}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-0 pb-3 px-4">
                  <p className="text-xs text-muted-foreground">{result.matchReason}</p>
                  {result.tradeoffs && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      ⚠️ {result.tradeoffs}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
