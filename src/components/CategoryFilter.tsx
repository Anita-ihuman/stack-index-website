import { Button } from '@/components/ui/button';
import type { ToolCategory } from '@/types/catalog';

const CATEGORY_META: Array<{ value: ToolCategory; label: string; emoji: string }> = [
  { value: 'container-orchestration', label: 'Container & Orch.', emoji: '📦' },
  { value: 'cicd', label: 'CI/CD', emoji: '🔄' },
  { value: 'observability', label: 'Observability', emoji: '📊' },
  { value: 'infrastructure-as-code', label: 'IaC', emoji: '🏗️' },
  { value: 'service-mesh-networking', label: 'Service Mesh', emoji: '🕸️' },
  { value: 'databases', label: 'Databases', emoji: '🗄️' },
  { value: 'message-queue', label: 'Message Queue', emoji: '📨' },
  { value: 'frontend-frameworks', label: 'Frontend', emoji: '🎨' },
  { value: 'backend-frameworks', label: 'Backend', emoji: '⚙️' },
  { value: 'security', label: 'Security', emoji: '🔒' },
  { value: 'data-analytics', label: 'Data & Analytics', emoji: '📈' },
  { value: 'developer-tools', label: 'Dev Tools', emoji: '🛠️' },
];

interface CategoryFilterProps {
  selected: ToolCategory | null;
  onChange: (category: ToolCategory | null) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(null)}
        className="text-xs h-8"
      >
        All Tools
        {counts && (
          <span className="ml-1.5 text-[10px] opacity-70">
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </span>
        )}
      </Button>
      {CATEGORY_META.map(({ value, label, emoji }) => (
        <Button
          key={value}
          variant={selected === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(selected === value ? null : value)}
          className="text-xs h-8"
        >
          <span className="mr-1">{emoji}</span>
          {label}
          {counts?.[value] !== undefined && (
            <span className="ml-1.5 text-[10px] opacity-70">{counts[value]}</span>
          )}
        </Button>
      ))}
    </div>
  );
}
