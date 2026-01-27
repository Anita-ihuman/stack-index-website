import pLimit from 'p-limit';
import { githubService } from './github.service';
import { documentationService } from './documentation.service';
import { communityService } from './community.service';
import { claudeService, AggregatedToolData } from './claude.service';
import { cacheService, CacheService, CACHE_TTLS } from './cache.service';
import { AnalysisMetadata, AnalysisResponse } from '../types/analysis.types';

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
    const analysis = type === 'comparison'
      ? await claudeService.analyzeComparison(toolsData)
      : await claudeService.analyzeDeepDive(toolsData[0]);
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
   * Fetch all data for tools in parallel
   */
  private async fetchAllData(tools: string[]): Promise<AggregatedToolData[]> {
    const fetchPromises = tools.map((tool) =>
      this.limit(async () => {
        console.log(`[Orchestrator] Fetching data for: ${tool}`);

        // Fetch all sources in parallel for this tool
        const [github, community] = await Promise.allSettled([
          githubService.fetchData(tool),
          communityService.fetchData(tool),
        ]);

        const githubData = github.status === 'fulfilled' ? github.value : null;

        // Fetch documentation (pass GitHub README as fallback)
        const docsResult = await documentationService.fetchData(
          tool,
          githubData?.readme?.content
        );

        const communityData = community.status === 'fulfilled' ? community.value : null;

        return {
          tool,
          github: githubData || undefined,
          docs: docsResult || undefined,
          community: communityData || undefined,
        };
      })
    );

    return Promise.all(fetchPromises);
  }

  /**
   * Create metadata from fetched data
   */
  private createMetadata(toolsData: AggregatedToolData[]): AnalysisMetadata {
    const hasGitHub = toolsData.some((t) => t.github);
    const hasDocs = toolsData.some((t) => t.docs);
    const hasCommunity = toolsData.some((t) => t.community);

    // Calculate data ages (approximate)
    const now = new Date();
    const dataAge: AnalysisMetadata['dataAge'] = {};

    if (hasGitHub) {
      dataAge.github = 'just now'; // Fresh data
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
      dataAge.community = 'just now'; // Fresh data
    }

    return {
      sources: {
        github: hasGitHub,
        documentation: hasDocs,
        community: hasCommunity,
      },
      fetchedAt: now.toISOString(),
      tokensUsed: 0, // Could be calculated if needed
      dataAge,
    };
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
