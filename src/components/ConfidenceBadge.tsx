import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DataConfidence } from '@/types/catalog';

interface ConfidenceBadgeProps {
  confidence: DataConfidence;
  size?: 'sm' | 'md';
}

const CONFIG: Record<DataConfidence, { label: string; className: string; tooltip: string }> = {
  live_data: {
    label: 'Live',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    tooltip: 'Data fetched live from GitHub, npm, and community APIs',
  },
  cached: {
    label: 'Cached',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    tooltip: 'Data served from cache (refreshed periodically)',
  },
  ai_inferred: {
    label: 'AI',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    tooltip: 'Inferred by AI from catalog metadata — no live API data available',
  },
};

export function ConfidenceBadge({ confidence, size = 'sm' }: ConfidenceBadgeProps) {
  const cfg = CONFIG[confidence];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={`${cfg.className} cursor-help ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs'}`}
        >
          {cfg.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs max-w-[200px]">{cfg.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
