import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { ToolCatalogEntry } from '@/types/catalog';

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

const MATURITY_COLORS: Record<string, string> = {
  mature: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  growing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  emerging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  legacy: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
};

interface ToolCardProps {
  tool: ToolCatalogEntry;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link to={`/tools/${tool.slug}`} className="group block">
      <Card className="h-full border border-border hover:border-primary/50 transition-all duration-200 group-hover:shadow-md bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-mono font-bold leading-tight">
              {tool.name}
            </CardTitle>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge variant="secondary" className="text-[10px] font-normal">
              {CATEGORY_LABELS[tool.category] ?? tool.category}
            </Badge>
            <Badge variant="outline" className={`text-[10px] font-normal ${MATURITY_COLORS[tool.maturityLevel]}`}>
              {tool.maturityLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {tool.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
