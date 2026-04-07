import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RiskAnalysis as RiskAnalysisType } from '@/types/analysis';

interface RiskAnalysisProps {
  riskAnalysis: RiskAnalysisType;
}

const RISK_COLORS: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
};

const RISK_DIMENSIONS = [
  { key: 'vendorLockIn', label: 'Vendor Lock-In' },
  { key: 'communityRisk', label: 'Community Risk' },
  { key: 'operationalRisk', label: 'Operational Risk' },
  { key: 'maturityRisk', label: 'Maturity Risk' },
] as const;

export function RiskAnalysis({ riskAnalysis }: RiskAnalysisProps) {
  const { risks } = riskAnalysis;
  if (!risks || risks.length === 0) return null;

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  Tool
                </th>
                {RISK_DIMENSIONS.map((d) => (
                  <th key={d.key} className="text-left py-2 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr key={risk.toolName} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-mono font-semibold text-sm whitespace-nowrap">
                    {risk.toolName}
                  </td>
                  {RISK_DIMENSIONS.map((d) => (
                    <td key={d.key} className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${RISK_COLORS[risk[d.key]]}`}
                      >
                        {risk[d.key]}
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mt-4 space-y-2">
          {risks.map((risk) => risk.notes && (
            <div key={risk.toolName} className="text-xs text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{risk.toolName}: </span>
              {risk.notes}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
