import axios, { AxiosInstance } from 'axios';
import { env } from '../config/environment';
import { toolCatalogService } from './tool-catalog.service';
import { SearchRequest, SearchResponse, SearchResult, DataConfidence } from '../types/catalog.types';
import { ExternalAPIError } from '../utils/errorHandler';

interface ClaudeSearchResponseRaw {
  intent: SearchResponse['intent'];
  constraints: SearchResponse['constraints'];
  results: Array<{
    slug: string;
    relevanceScore: number;
    matchReason: string;
    tradeoffs?: string;
  }>;
  summary: string;
}

/**
 * Claude-powered semantic search over the tool catalog.
 * Hallucination guard: all slugs returned by Claude are validated against catalog.
 */
export class SearchService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      timeout: 30000,
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    });
  }

  async search(req: SearchRequest): Promise<SearchResponse> {
    const { query, limit = 5, category } = req;

    // Filter catalog if category provided
    const allTools = category
      ? toolCatalogService.getByCategory(category)
      : toolCatalogService.getAll();

    if (allTools.length === 0) {
      return this.emptyResponse(query);
    }

    const catalogSummary = this.buildCatalogContext(allTools);
    const validSlugs = new Set(allTools.map((t) => t.slug));

    const system = `You are a developer tool recommendation engine for StackIndex.
You have access to a catalog of developer tools and must recommend the best matches for user queries.
You must ONLY reference tools by their exact slugs from the provided catalog.
Do NOT invent or guess tool slugs — only use slugs exactly as listed in the catalog.
Respond with ONLY valid JSON. No markdown, no code blocks.`;

    const userPrompt = `TOOL CATALOG (slug | name | category | tags | description):
${catalogSummary}

USER QUERY: "${query}"

Analyze the query and return the ${limit} most relevant tools from the catalog above.

Respond with ONLY valid JSON matching this structure:
{
  "intent": "find_tool" | "compare_tools" | "browse_category" | "get_recommendation",
  "constraints": {
    "budget": "free" | "paid" | "any",
    "scale": "description of scale requirements if mentioned",
    "existingStack": ["tool-slug-1"],
    "category": "category if mentioned"
  },
  "results": [
    {
      "slug": "exact-slug-from-catalog",
      "relevanceScore": 85,
      "matchReason": "Why this tool matches the query",
      "tradeoffs": "Key tradeoffs to consider"
    }
  ],
  "summary": "2-3 sentence summary of recommendations"
}`;

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const raw = JSON.parse(response.data.content[0].text) as ClaudeSearchResponseRaw;

      // Hallucination guard: filter to only valid catalog slugs
      const validResults = raw.results.filter((r) => {
        if (!validSlugs.has(r.slug)) {
          console.warn(`[Search] Discarding hallucinated slug: "${r.slug}"`);
          return false;
        }
        return true;
      });

      const results: SearchResult[] = validResults.map((r, idx) => {
        const tool = toolCatalogService.getBySlug(r.slug)!;
        const confidence: DataConfidence = 'ai_inferred';
        return {
          rank: idx + 1,
          toolSlug: r.slug,
          toolName: tool.name,
          relevanceScore: Math.min(100, Math.max(0, r.relevanceScore)),
          matchReason: r.matchReason,
          tradeoffs: r.tradeoffs,
          dataConfidence: confidence,
        };
      });

      return {
        query,
        intent: raw.intent,
        constraints: raw.constraints || {},
        results,
        summary: raw.summary,
        searchedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[Search] Claude API error:', error.response?.data);
        throw new ExternalAPIError('Claude', error.message);
      }
      // Fall back to text search on parse error
      console.error('[Search] Falling back to text search:', error);
      return this.textSearchFallback(query, allTools, limit);
    }
  }

  private buildCatalogContext(
    tools: ReturnType<typeof toolCatalogService.getAll>
  ): string {
    return tools
      .map(
        (t) =>
          `${t.slug} | ${t.name} | ${t.category} | ${t.tags.join(',')} | ${t.description.slice(0, 100)}`
      )
      .join('\n');
  }

  private textSearchFallback(
    query: string,
    tools: ReturnType<typeof toolCatalogService.getAll>,
    limit: number
  ): SearchResponse {
    const q = query.toLowerCase();
    const scored = tools
      .map((t) => {
        let score = 0;
        if (t.name.toLowerCase().includes(q)) score += 50;
        if (t.tags.some((tag) => tag.includes(q))) score += 30;
        if (t.description.toLowerCase().includes(q)) score += 20;
        return { tool: t, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      query,
      intent: 'find_tool',
      constraints: {},
      results: scored.map((r, idx) => ({
        rank: idx + 1,
        toolSlug: r.tool.slug,
        toolName: r.tool.name,
        relevanceScore: r.score,
        matchReason: `Matched keyword "${query}" in tool name, tags, or description.`,
        dataConfidence: 'ai_inferred' as DataConfidence,
      })),
      summary: `Found ${scored.length} tools matching "${query}" via keyword search.`,
      searchedAt: new Date().toISOString(),
    };
  }

  private emptyResponse(query: string): SearchResponse {
    return {
      query,
      intent: 'find_tool',
      constraints: {},
      results: [],
      summary: 'No tools found matching the query.',
      searchedAt: new Date().toISOString(),
    };
  }
}

export const searchService = new SearchService();
