import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'best observability for Kubernetes',
  'free CI/CD for small teams',
  'PostgreSQL vs MongoDB',
  'message queue with low operational overhead',
  'IaC tool for multi-cloud',
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading, placeholder = 'Ask anything about developer tools...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExample = (q: string) => {
    setQuery(q);
    onSearch(q);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-9 font-mono text-sm"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={!query.trim() || isLoading} className="shrink-0">
          <Sparkles className="w-4 h-4 mr-1.5" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Try:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => handleExample(q)}
            className="text-xs text-primary/70 hover:text-primary bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-full transition-colors font-mono"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
