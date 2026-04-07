import pLimit from 'p-limit';
import { githubService } from './github.service';
import { documentationService } from './documentation.service';
import { communityService } from './community.service';
import { claudeService, AggregatedToolData } from './claude.service';
import { cacheService, CacheService, CACHE_TTLS } from './cache.service';
import { mcpRegistry } from './mcp-registry.service';
import { mcpClient } from './mcp-client.service';
import { toolCatalogService } from './tool-catalog.service';
import { scoringService } from './scoring.service';
import { AnalysisMetadata, AnalysisResponse } from '../types/analysis.types';
import { ToolScore } from '../types/catalog.types';

/**
 * Detect analysis type from input string
 */
export function detectAnalysisType(input: string): 'comparison' | 'deepdive' {
  const separators = [' vs ', ' vs. ', ',', ' and ', ' or ', ' versus '];
  const lowerInput = input.toLowerCase();

  for (const separator of separators) {
    if (lowerInput.includes(separator)) {
      return 'comparison';
    }
  }

  return 'deepdive';
}

/**
 * Parse tools from input string
 */
export function parseToolsFromInput(input: string): string[] {
  const separators = [' vs ', ' vs. ', ',', ' and ', ' or ', ' versus '];
  const lowerInput = input.toLowerCase();

  for (const separator of separators) {
    if (lowerInput.includes(separator)) {
      return input
        .split(new RegExp(separator, 'i'))
        .map((tool) => tool.trim())
        .filter((tool) => tool.length > 0);
    }
  }

  // Single tool
  return [input.trim()];
}

/**
 * Orchestrator Service - Coordinates all data fetching and analysis
 */
export class OrchestratorService {
  private limit = pLimit(10); // Max 10 concurrent requests

  /**
   * Main analysis orchestration
   */
  async analyze(input: string, type: 'comparison' | 'deepdive'): Promise<AnalysisResponse> {
    console.log(`[Orchestrator] Analyzing: "${input}" (${type})`);

    // Check cache for complete analysis
    const cacheKey = CacheService.analysisKey(input, type);
    const cached = await cacheService.get<AnalysisResponse>(cacheKey);
    if (cached) {
      console.log(`[Orchestrator] Cache hit for analysis`);
      return cached;
    }

    // Parse tools from input
    const tools = parseToolsFromInput(input);
    console.log(`[Orchestrator] Detected tools:`, tools);

    // Fetch all data in parallel
    const startTime = Date.now();
    const toolsData = await this.fetchAllData(tools);
    const fetchDuration = Date.now() - startTime;
    console.log(`[Orchestrator] Data fetching completed in ${fetchDuration}ms`);

    // Generate analysis with Claude
    const analysisStartTime = Date.now();
    let analysis;
    if (type === 'comparison') {
      // Try enhanced comparison with scoring; fall back to base if catalog lookup fails
      const scores = await this.fetchScoresForTools(tools);
      const hasEnhancedData = toolsData.length > 1;
      if (hasEnhancedData) {
        try {
          analysis = await claudeService.analyzeComparisonEnhanced(toolsData, scores);
        } catch (enhancedErr) {
          console.warn('[Orchestrator] Enhanced comparison failed, falling back:', enhancedErr);
          analysis = await claudeService.analyzeComparison(toolsData);
        }
      } else {
        analysis = await claudeService.analyzeComparison(toolsData);
      }
    } else {
      analysis = await claudeService.analyzeDeepDive(toolsData[0]);
    }
    const analysisDuration = Date.now() - analysisStartTime;
    console.log(`[Orchestrator] Claude analysis completed in ${analysisDuration}ms`);

    // Create metadata
    const metadata = this.createMetadata(toolsData);

    const response: AnalysisResponse = {
      analysis,
      metadata,
    };

    // Cache the complete result
    await cacheService.set(cacheKey, response, CACHE_TTLS.analysis.complete);

    return response;
  }

  /**
   * Fetch all data for tools in parallel.
   *
   * Data priority per tool:
   *   1. MCP Server (org-verified, live docs)   → mcpVerified = true
   *   2. Documentation scraping (cheerio)
   *   3. GitHub README fallback
   *   4. Nothing (Claude falls back to training data)
   */
  private async fetchAllData(tools: string[]): Promise<AggregatedToolData[]> {
    const fetchPromises = tools.map((tool) =>
      this.limit(async () => {
        console.log(`[Orchestrator] Fetching data for: ${tool}`);

        // Fetch GitHub and community data in parallel (not affected by MCP)
        const [github, community] = await Promise.allSettled([
          githubService.fetchData(tool),
          communityService.fetchData(tool),
        ]);

        const githubData = github.status === 'fulfilled' ? github.value : null;
        const communityData = community.status === 'fulfilled' ? community.value : null;

        // ------------------------------------------------------------------
        // MCP LAYER: check registry and attempt live doc fetch
        // ------------------------------------------------------------------
        const mcpConfig = mcpRegistry.get(tool);
        let docsResult = null;
        let mcpVerified = false;
        let mcpOrgName: string | undefined;

        if (mcpConfig) {
          console.log(
            `[Orchestrator] MCP server found for "${tool}" (${mcpConfig.orgName}) — fetching verified docs`
          );
          const mcpDocs = await mcpClient.fetchDocumentation(tool, mcpConfig);

          if (mcpDocs) {
            docsResult = mcpDocs; // already matches DocumentationData shape
            mcpVerified = true;
            mcpOrgName = mcpConfig.orgName;
            console.log(`[Orchestrator] MCP docs fetched successfully for "${tool}"`);
          } else {
            console.log(
              `[Orchestrator] MCP fetch failed for "${tool}" — falling back to scraping`
            );
          }
        }

        // ------------------------------------------------------------------
        // Fallback: scrape official docs if MCP not available/failed
        // ------------------------------------------------------------------
        if (!docsResult) {
          docsResult = await documentationService.fetchData(
            tool,
            githubData?.readme?.content
          );
        }

        const mcpFallback = !!mcpConfig && !mcpVerified;

        return {
          tool,
          github: githubData || undefined,
          docs: docsResult || undefined,
          community: communityData || undefined,
          mcpVerified,
          mcpOrgName,
          mcpServerUrl: mcpConfig?.mcpServerUrl,
          mcpFallback,
        };
      })
    );

    return Promise.all(fetchPromises);
  }

  /**
   * Create metadata from fetched data — now includes MCP source tracking.
   */
  private createMetadata(toolsData: AggregatedToolData[]): AnalysisMetadata {
    const hasGitHub = toolsData.some((t) => t.github);
    const hasDocs = toolsData.some((t) => t.docs);
    const hasCommunity = toolsData.some((t) => t.community);
    const hasMCP = toolsData.some((t) => t.mcpVerified);

    const mcpVerifiedTools = toolsData
      .filter((t) => t.mcpVerified)
      .map((t) => t.tool);

    const mcpFallbackTools = toolsData
      .filter((t) => t.mcpFallback)
      .map((t) => t.tool);

    // Calculate data ages (approximate)
    const now = new Date();
    const dataAge: AnalysisMetadata['dataAge'] = {};

    if (hasGitHub) {
      dataAge.github = 'just now';
    }

    if (hasDocs) {
      const firstDoc = toolsData.find((t) => t.docs)?.docs;
      if (firstDoc) {
        const scrapedAt = new Date(firstDoc.scrapedAt);
        const ageMinutes = Math.floor((now.getTime() - scrapedAt.getTime()) / 60000);
        if (ageMinutes < 60) {
          dataAge.docs = `${ageMinutes} minutes ago`;
        } else {
          const ageHours = Math.floor(ageMinutes / 60);
          dataAge.docs = `${ageHours} hours ago`;
        }
      }
    }

    if (hasCommunity) {
      dataAge.community = 'just now';
    }

    return {
      sources: {
        github: hasGitHub,
        documentation: hasDocs,
        community: hasCommunity,
        mcp: hasMCP,
      },
      fetchedAt: now.toISOString(),
      tokensUsed: 0,
      dataAge,
      mcpVerifiedTools: mcpVerifiedTools.length ? mcpVerifiedTools : undefined,
      mcpFallbackTools: mcpFallbackTools.length ? mcpFallbackTools : undefined,
    };
  }

  /**
   * Fetch pre-computed scores for tools using catalog service
   */
  private async fetchScoresForTools(tools: string[]): Promise<Array<ToolScore | null>> {
    return Promise.all(
      tools.map(async (toolName) => {
        const slug = toolName.toLowerCase().replace(/[\s.]/g, '-');
        const catalogEntry =
          toolCatalogService.getBySlug(slug) ||
          toolCatalogService.getBySlug(toolName.toLowerCase());
        if (!catalogEntry) return null;
        try {
          return await scoringService.computeScore(catalogEntry);
        } catch {
          return null;
        }
      })
    );
  }

  /**
   * Prefetch and cache data for common tools (warmup)
   */
  async prefetchCommonTools(tools: string[]): Promise<void> {
    console.log(`[Orchestrator] Prefetching ${tools.length} common tools...`);

    await Promise.all(
      tools.map((tool) =>
        this.limit(async () => {
          try {
            await this.fetchAllData([tool]);
            console.log(`[Orchestrator] Prefetched: ${tool}`);
          } catch (error) {
            console.error(`[Orchestrator] Error prefetching ${tool}:`, error);
          }
        })
      )
    );

    console.log(`[Orchestrator] Prefetch complete`);
  }
}

// Export singleton instance
export const orchestratorService = new OrchestratorService();
