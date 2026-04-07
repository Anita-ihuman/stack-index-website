import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { ComparisonScoringTable, DataConfidence } from '@/types/analysis';

interface ScoringTableProps {
  scoringTable: ComparisonScoringTable;
}

export function ScoringTable({ scoringTable }: ScoringTableProps) {
  const { tools } = scoringTable;
  if (!tools || tools.length === 0) return null;

  const dimensions = Object.keys(tools[0]?.dimensions ?? {});

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Scoring Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  Dimension
                </th>
                {tools.map((t) => (
                  <th key={t.slug} className="text-left py-2 px-3 font-mono font-semibold text-sm min-w-[140px]">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dim) => (
                <tr key={dim} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                    {dim}
                  </td>
                  {tools.map((tool) => {
                    const cell = tool.dimensions[dim];
                    const score = cell?.score;
                    const confidence = cell?.confidence as DataConfidence | undefined;
                    return (
                      <td key={tool.slug} className="py-2.5 px-3">
                        {score !== null && score !== undefined ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="h-1.5 flex-1" />
                              <span className="text-xs font-mono w-8 text-right">{score}</span>
                              {confidence && <ConfidenceBadge confidence={confidence} />}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">n/a</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-muted/30">
                <td className="py-2.5 pr-4 text-xs font-semibold">Total Score</td>
                {tools.map((tool) => (
                  <td key={tool.slug} className="py-2.5 px-3">
                    <span className="text-sm font-mono font-bold text-primary">
                      {tool.totalScore ?? '—'}/100
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
