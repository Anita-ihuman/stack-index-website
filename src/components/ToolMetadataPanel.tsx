import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github } from 'lucide-react';
import type { ToolCatalogEntry } from '@/types/catalog';

interface ToolMetadataPanelProps {
  tool: ToolCatalogEntry;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-xs text-right">{value}</span>
    </div>
  );
}

const COMPLEXITY_COLORS: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
};

const MATURITY_COLORS: Record<string, string> = {
  mature: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  growing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  emerging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  legacy: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
};

export function ToolMetadataPanel({ tool }: ToolMetadataPanelProps) {
  return (
    <div className="space-y-4">
      {/* Links */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Official Website
          </a>
          <a
            href={tool.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Documentation
          </a>
          {tool.githubRepo && (
            <a
              href={`https://github.com/${tool.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              {tool.githubRepo}
            </a>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <MetaRow label="License" value={<span className="font-mono">{tool.license}</span>} />
          <MetaRow
            label="Pricing"
            value={
              <Badge variant="outline" className="text-[10px] capitalize">
                {tool.pricingModel}
              </Badge>
            }
          />
          <MetaRow
            label="Deployment"
            value={
              <Badge variant="outline" className="text-[10px] capitalize">
                {tool.deploymentModel}
              </Badge>
            }
          />
          <MetaRow
            label="Maturity"
            value={
              <Badge variant="outline" className={`text-[10px] capitalize ${MATURITY_COLORS[tool.maturityLevel]}`}>
                {tool.maturityLevel}
              </Badge>
            }
          />
          <MetaRow
            label="Complexity"
            value={
              <Badge variant="outline" className={`text-[10px] capitalize ${COMPLEXITY_COLORS[tool.operationalComplexity]}`}>
                {tool.operationalComplexity}
              </Badge>
            }
          />
        </CardContent>
      </Card>

      {/* Key Integrations */}
      {tool.keyIntegrations.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Key Integrations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {tool.keyIntegrations.map((integration) => (
                <Badge key={integration} variant="secondary" className="text-[10px] font-normal">
                  {integration}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {tool.tags.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-primary/70 bg-primary/5 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
