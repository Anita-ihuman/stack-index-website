import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { DecisionGuidance as DecisionGuidanceType } from '@/types/analysis';

interface DecisionGuidanceProps {
  guidance: DecisionGuidanceType;
}

const MIGRATION_COLORS: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
};

export function DecisionGuidance({ guidance }: DecisionGuidanceProps) {
  const { choices, migrationComplexity, migrationNotes } = guidance;

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Decision Guidance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Choose / Avoid grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {choices.map((choice) => (
            <div key={choice.toolName} className="space-y-3">
              <h4 className="font-mono font-semibold text-sm border-b border-border pb-1">
                {choice.toolName}
              </h4>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1.5">
                  Choose if
                </p>
                <ul className="space-y-1">
                  {choice.chooseIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold mb-1.5">
                  Avoid if
                </p>
                <ul className="space-y-1">
                  {choice.avoidIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Migration notes */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Migration Complexity
            </span>
            <Badge variant="outline" className={`text-[10px] ${MIGRATION_COLORS[migrationComplexity]}`}>
              {migrationComplexity}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{migrationNotes}</p>
        </div>
      </CardContent>
    </Card>
  );
}
