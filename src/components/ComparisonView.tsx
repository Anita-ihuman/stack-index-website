import { ComparisonAnalysis } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Star } from 'lucide-react';

interface ComparisonViewProps {
  analysis: ComparisonAnalysis;
}

export function ComparisonView({ analysis }: ComparisonViewProps) {
  const { tools, comparisonSummary, recommendation } = analysis;

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{comparisonSummary}</p>
          {recommendation && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Recommendation</h4>
              <p className="text-sm text-foreground">{recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison Table */}
      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <Card
            key={index}
            className="border-2 hover:border-primary/50 transition-all duration-300 bg-card"
          >
            <CardHeader className="bg-secondary/20 border-b">
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-bold font-mono">
                  {tool.name}
                </CardTitle>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold font-mono text-sm">
                    {tool.communityRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <CardDescription className="mt-2 text-base">
                {tool.technicalSummary}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Use Cases */}
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Use Cases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tool.useCases.map((useCase, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="font-mono text-xs"
                    >
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {tool.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {tool.topProsCons.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {tool.topProsCons.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <XCircle className="w-3 h-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Architectural Insights */}
              {tool.architecturalInsights && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                    Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                    {tool.architecturalInsights}
                  </p>
                </div>
              )}

              {/* Gotchas */}
              {tool.gotchas && tool.gotchas.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                    ⚠️ Gotchas
                  </h4>
                  <ul className="space-y-1">
                    {tool.gotchas.map((gotcha, i) => (
                      <li key={i} className="text-xs text-foreground">
                        • {gotcha}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
