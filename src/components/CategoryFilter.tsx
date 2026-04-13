import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ToolCategory } from '@/types/catalog';

const CATEGORY_META: Array<{ value: ToolCategory; label: string; emoji: string }> = [
  { value: 'container-orchestration', label: 'Container & Orchestration', emoji: '📦' },
  { value: 'cicd',                    label: 'CI/CD',                     emoji: '🔄' },
  { value: 'observability',           label: 'Observability',             emoji: '📊' },
  { value: 'infrastructure-as-code',  label: 'Infrastructure as Code',    emoji: '🏗️' },
  { value: 'service-mesh-networking', label: 'Service Mesh & Networking', emoji: '🕸️' },
  { value: 'databases',               label: 'Databases',                 emoji: '🗄️' },
  { value: 'message-queue',           label: 'Message Queue',             emoji: '📨' },
  { value: 'frontend-frameworks',     label: 'Frontend Frameworks',       emoji: '🎨' },
  { value: 'backend-frameworks',      label: 'Backend Frameworks',        emoji: '⚙️' },
  { value: 'security',                label: 'Security',                  emoji: '🔒' },
  { value: 'data-analytics',          label: 'Data & Analytics',          emoji: '📈' },
  { value: 'developer-tools',         label: 'Developer Tools',           emoji: '🛠️' },
];

interface CategoryFilterProps {
  selected: ToolCategory | null;
  onChange: (category: ToolCategory | null) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : null;

  return (
    <Select
      value={selected ?? 'all'}
      onValueChange={(val) => onChange(val === 'all' ? null : val as ToolCategory)}
    >
      <SelectTrigger className="w-64 font-mono text-sm">
        <SelectValue placeholder="Browse by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All Categories
          {total !== null && <span className="ml-2 text-xs text-muted-foreground">{total}</span>}
        </SelectItem>
        {CATEGORY_META.map(({ value, label, emoji }) => (
          <SelectItem key={value} value={value}>
            <span className="mr-2">{emoji}</span>
            {label}
            {counts?.[value] !== undefined && (
              <span className="ml-2 text-xs text-muted-foreground">{counts[value]}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
