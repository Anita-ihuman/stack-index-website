import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ToolCard } from '@/components/ToolCard';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { catalogApi } from '@/lib/apiClient';
import type { ToolCategory, SearchResponse } from '@/types/catalog';

export default function Tools() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'search'>('browse');
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Handle ?q= param from ⌘K palette AI suggestion clicks
  useEffect(() => {
    const q = searchParams.get('q');
    if (q?.trim()) {
      handleSearch(q.trim());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ['tools', selectedCategory],
    queryFn: () => catalogApi.listTools(selectedCategory ? { category: selectedCategory } : undefined),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogApi.listCategories(),
  });

  const categoryCounts = categoriesData?.categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = c.count;
    return acc;
  }, {});

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setActiveTab('search');
    try {
      const result = await catalogApi.search(query, {
        limit: 8,
        category: selectedCategory ?? undefined,
      });
      setSearchResponse(result);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="DevOps & Cloud Tools Catalog"
        description="Browse and compare 57+ DevOps and cloud tools across CI/CD, IaC, observability, container orchestration, service mesh, security, and more. Scored across 8 real dimensions."
        path="/tools"
      />
      <Header />

      <main className="container py-10 space-y-8">
        {/* Hero */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-mono">Tool Catalog</h1>
          <p className="text-muted-foreground">
            Browse and search {toolsData?.count ?? '57+'} DevOps & cloud tools across 12 categories.
            Select any tool for AI-powered insights from live documentation.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'browse' | 'search')}>
          <TabsList>
            <TabsTrigger value="browse">Browse by Category</TabsTrigger>
            <TabsTrigger value="search" disabled={!searchResponse && !isSearching}>
              Search Results
              {searchResponse && (
                <span className="ml-1.5 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  {searchResponse.results.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6 mt-6">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
              counts={categoryCounts}
            />

            {toolsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">
                  Showing {toolsData?.count ?? 0} tools
                  {selectedCategory && ` in ${selectedCategory}`}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {toolsData?.tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            {isSearching ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : searchResponse ? (
              <SearchResults response={searchResponse} allTools={toolsData?.tools ?? []} />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Use the search bar above to find tools.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
