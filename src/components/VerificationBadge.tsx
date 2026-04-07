import { ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge as VerificationBadgeType } from '@/types/analysis';

interface VerificationBadgeProps {
  badge: VerificationBadgeType;
  /** 'sm' renders an inline icon-only badge; 'md' shows org name */
  size?: 'sm' | 'md';
}

/**
 * Shown when a tool's documentation was sourced from an org's
 * registered MCP server, guaranteeing live, hallucination-free data.
 */
export function VerificationBadge({ badge, size = 'md' }: VerificationBadgeProps) {
  const fetchedAt = new Date(badge.fetchedAt).toLocaleTimeString();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`
              border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
              hover:bg-emerald-500/20 cursor-help transition-colors
              ${size === 'sm' ? 'px-1.5 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5'}
            `}
          >
            <ShieldCheck
              className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
              aria-hidden="true"
            />
            {size === 'md' && (
              <span className="font-semibold tracking-wide">
                Verified by {badge.orgName}
              </span>
            )}
            {size === 'sm' && (
              <span className="font-semibold tracking-wide">Verified</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs space-y-1">
          <p className="font-semibold text-emerald-500">MCP Verified Documentation</p>
          <p className="text-muted-foreground">
            This analysis is grounded in live documentation fetched directly from{' '}
            <strong>{badge.orgName}</strong>'s official MCP server.
          </p>
          <p className="text-muted-foreground">
            AI hallucinations are eliminated — the data reflects the{' '}
            <strong>latest release</strong>.
          </p>
          <p className="text-muted-foreground/70 pt-1">
            Fetched at {fetchedAt} &bull; {badge.mcpServerUrl}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
