import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { catalogApi } from '@/lib/apiClient';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import type { ToolCatalogEntry } from '@/types/catalog';

const CATEGORY_LABELS: Record<string, string> = {
  'container-orchestration': 'Container',
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

const AI_SUGGESTIONS = [
  'best observability for Kubernetes',
  'free CI/CD for small teams',
  'lightweight service mesh',
  'IaC tool for multi-cloud',
  'message queue with low overhead',
];

interface ToolCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: pre-seed the search input */
  initialQuery?: string;
}

export function ToolCommandPalette({ open, onOpenChange, initialQuery }: ToolCommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [aiResults, setAiResults] = useState<ToolCatalogEntry[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSearched, setAiSearched] = useState(false);

  // Load full catalog for instant local filtering
  const { data: catalogData } = useQuery({
    queryKey: ['tools'],
    queryFn: () => catalogApi.listTools(),
    staleTime: 5 * 60 * 1000,
  });

  const allTools = catalogData?.tools ?? [];

  // Local instant filter — name, tags, category, description
  const localMatches = query.trim().length > 0
    ? allTools.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[t.category]?.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : allTools.slice(0, 8);

  // AI search — fires after 600ms debounce when query looks like natural language
  const isNaturalLanguage = query.trim().split(' ').length >= 3;

  useEffect(() => {
    if (!open) return;
    if (!isNaturalLanguage || query.trim().length < 8) {
      setAiResults([]);
      setAiSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await catalogApi.search(query.trim(), { limit: 5 });
        const slugSet = new Set(localMatches.map((t) => t.slug));
        const enriched = res.results
          .map((r) => allTools.find((t) => t.slug === r.toolSlug))
          .filter((t): t is ToolCatalogEntry => !!t && !slugSet.has(t.slug));
        setAiResults(enriched);
        setAiSearched(true);
      } catch {
        // silent fail — local results still show
      } finally {
        setAiLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery(initialQuery ?? '');
      setAiResults([]);
      setAiSearched(false);
    }
  }, [open, initialQuery]);

  const selectTool = useCallback((slug: string) => {
    onOpenChange(false);
    navigate(`/tools/${slug}`);
  }, [navigate, onOpenChange]);

  const runAISuggestion = useCallback((q: string) => {
    onOpenChange(false);
    navigate(`/tools?q=${encodeURIComponent(q)}`);
  }, [navigate, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools or ask anything..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[480px]">

        {/* Empty state */}
        <CommandEmpty>
          {aiLoading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching with AI…
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tools found.</span>
          )}
        </CommandEmpty>

        {/* Instant local results */}
        {localMatches.length > 0 && (
          <CommandGroup heading={query.trim() ? 'Tools' : 'All Tools'}>
            {localMatches.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`${tool.name} ${tool.slug} ${tool.tags.join(' ')}`}
                onSelect={() => selectTool(tool.slug)}
                className="flex items-center justify-between gap-3 py-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="font-mono font-medium text-sm">{tool.name}</span>
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {CATEGORY_LABELS[tool.category] ?? tool.category}
                  </Badge>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* AI results */}
        {aiResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="AI Recommendations">
              {aiResults.map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={`ai-${tool.slug}`}
                  onSelect={() => selectTool(tool.slug)}
                  className="flex items-center justify-between gap-3 py-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <span className="font-mono font-medium text-sm">{tool.name}</span>
                      <p className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {CATEGORY_LABELS[tool.category] ?? tool.category}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* AI loading indicator */}
        {aiLoading && localMatches.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="AI Recommendations">
              <div className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Fetching AI recommendations…
              </div>
            </CommandGroup>
          </>
        )}

        {/* Try these queries — shown when no search query */}
        {!query.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Try asking">
              {AI_SUGGESTIONS.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  value={`suggestion-${suggestion}`}
                  onSelect={() => runAISuggestion(suggestion)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-sm font-mono text-muted-foreground">{suggestion}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

      </CommandList>

      {/* Footer hint */}
      <div className="border-t px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">
          ↑↓ navigate · ↵ select · esc close
        </span>
        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          AI search activates on natural language
        </span>
      </div>
    </CommandDialog>
  );
}
