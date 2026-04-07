import axios, { AxiosInstance } from 'axios';
import { env } from '../config/environment';
import { ComparisonAnalysis, DeepDiveAnalysis, EnhancedComparisonAnalysis } from '../types/analysis.types';
import { GitHubData } from '../types/github.types';
import { DocumentationData } from './documentation.service';
import { CommunityData } from './community.service';
import { ToolScore } from '../types/catalog.types';
import { ExternalAPIError } from '../utils/errorHandler';

/**
 * Aggregated tool data for Claude.
 * mcpVerified=true means docs came from a registered MCP server —
 * Claude must prioritize this over its training data.
 */
export interface AggregatedToolData {
  tool: string;
  github?: GitHubData;
  docs?: DocumentationData;
  community?: CommunityData;
  /** True when docs were sourced from the org's MCP server */
  mcpVerified?: boolean;
  /** Org name displayed in the Verified badge */
  mcpOrgName?: string;
  /** MCP server URL for provenance metadata */
  mcpServerUrl?: string;
  /** True when an MCP server was registered but the fetch failed (fell back to scraping) */
  mcpFallback?: boolean;
}

/**
 * Claude Service for AI-powered analysis
 */
export class ClaudeService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      timeout: 60000,
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Analyze tools using Claude with real-time data
   */
  async analyzeComparison(toolsData: AggregatedToolData[]): Promise<ComparisonAnalysis> {
    const prompt = this.generateComparisonPrompt(toolsData);

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: prompt.system,
        messages: [
          {
            role: 'user',
            content: prompt.user,
          },
        ],
      });

      const content = response.data.content[0].text;
      const analysis = JSON.parse(content) as ComparisonAnalysis;

      // Enrich with real-time data + MCP verification badge
      analysis.tools = analysis.tools.map((tool, index) => {
        const data = toolsData[index];
        return {
          ...tool,
          githubUrl: data.github?.repository.url,
          githubRepo: data.github?.repository.fullName,
          metrics: data.github
            ? {
                stars: data.github.repository.stars,
                forks: data.github.repository.forks,
                downloads: data.community?.npm
                  ? `${this.formatNumber(data.community.npm.downloads.lastMonth)}/month`
                  : undefined,
                recentActivity: data.github.activity.recentCommits
                  ? `${data.github.activity.recentCommits} commits (30 days)`
                  : undefined,
              }
            : undefined,
          documentationUrl: data.docs?.url,
          lastUpdated: new Date().toISOString(),
          verificationBadge: data.mcpVerified && data.mcpOrgName && data.mcpServerUrl
            ? {
                verified: true as const,
                orgName: data.mcpOrgName,
                mcpServerUrl: data.mcpServerUrl,
                fetchedAt: new Date().toISOString(),
              }
            : undefined,
        };
      });

      return analysis;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetail = error.response?.data?.error
          ? JSON.stringify(error.response.data.error)
          : error.message;
        console.error('[Claude] API Error:', errorDetail);
        throw new ExternalAPIError('Claude', errorDetail);
      }
      console.error('[Claude] Unknown Error:', error);
      throw error;
    }
  }

  /**
   * Enhanced comparison with scoring table, decision guidance, and risk analysis
   */
  async analyzeComparisonEnhanced(
    toolsData: AggregatedToolData[],
    scores: Array<ToolScore | null>
  ): Promise<EnhancedComparisonAnalysis> {
    const prompt = this.generateEnhancedComparisonPrompt(toolsData, scores);

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-sonnet-4-6',
        max_tokens: 6144,
        system: prompt.system,
        messages: [{ role: 'user', content: prompt.user }],
      });

      const content = response.data.content[0].text;
      const analysis = JSON.parse(content) as EnhancedComparisonAnalysis;

      // Enrich with real-time data (same as base comparison)
      analysis.tools = analysis.tools.map((tool, index) => {
        const data = toolsData[index];
        if (!data) return tool;
        return {
          ...tool,
          githubUrl: data.github?.repository.url,
          githubRepo: data.github?.repository.fullName,
          metrics: data.github
            ? {
                stars: data.github.repository.stars,
                forks: data.github.repository.forks,
                downloads: data.community?.npm
                  ? `${this.formatNumber(data.community.npm.downloads.lastMonth)}/month`
                  : undefined,
                recentActivity: data.github.activity.recentCommits
                  ? `${data.github.activity.recentCommits} commits (30 days)`
                  : undefined,
              }
            : undefined,
          documentationUrl: data.docs?.url,
          lastUpdated: new Date().toISOString(),
          verificationBadge:
            data.mcpVerified && data.mcpOrgName && data.mcpServerUrl
              ? {
                  verified: true as const,
                  orgName: data.mcpOrgName,
                  mcpServerUrl: data.mcpServerUrl,
                  fetchedAt: new Date().toISOString(),
                }
              : undefined,
        };
      });

      return analysis;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetail = error.response?.data?.error
          ? JSON.stringify(error.response.data.error)
          : error.message;
        console.error('[Claude] Enhanced comparison error:', errorDetail);
        throw new ExternalAPIError('Claude', errorDetail);
      }
      throw error;
    }
  }

  /**
   * Generate enhanced comparison prompt with scoring context
   */
  private generateEnhancedComparisonPrompt(
    toolsData: AggregatedToolData[],
    scores: Array<ToolScore | null>
  ): { system: string; user: string } {
    const hasMCPData = toolsData.some((d) => d.mcpVerified);

    const system = `You are a technical analyst for StackIndex with access to REAL-TIME DATA from GitHub, official documentation, and community platforms.
${hasMCPData ? `\nIMPORTANT — MCP VERIFIED DOCUMENTATION: Some tools have documentation fetched directly from the organization's official MCP server. Treat MCP-verified content as authoritative.\n` : ''}
Your task is to provide data-driven analysis with enhanced scoring, decision guidance, and risk analysis.
CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no additional text.`;

    const toolsContext = toolsData.map((data, i) => {
      const score = scores[i];
      let ctx = this.formatToolContext(data);
      if (score && score.overall > 0) {
        ctx += `\n### Pre-Computed Score (use as context, not replacement for your analysis)\n`;
        ctx += `- Overall: ${score.overall}/100\n`;
        ctx += `- GitHub Stars: ${score.dimensions.githubStars.normalized}/100\n`;
        ctx += `- Contributor Velocity: ${score.dimensions.contributorVelocity.normalized}/100\n`;
        ctx += `- Community Activity: ${score.dimensions.communityActivity.normalized}/100\n`;
        ctx += `- Maintenance Health: ${score.dimensions.maintenanceHealth.normalized}/100\n`;
        ctx += `- Data Confidence: ${score.dataConfidence}\n`;
      }
      return ctx;
    }).join('\n\n---\n\n');

    const toolNames = toolsData.map((d) => d.tool).join(' vs ');

    const user = `Compare: ${toolNames}

REAL-TIME DATA:
${toolsContext}

Provide comprehensive comparison with enhanced decision guidance and risk analysis.

Respond with ONLY valid JSON matching this structure:
{
  "tools": [
    {
      "name": "Tool Name",
      "technicalSummary": "Brief technical overview",
      "useCases": ["Use case 1"],
      "strengths": ["Strength 1"],
      "communityRating": 4.5,
      "topProsCons": { "pros": ["Pro 1"], "cons": ["Con 1"] },
      "architecturalInsights": "Architecture details",
      "gotchas": ["Gotcha 1"]
    }
  ],
  "comparisonSummary": "Overall comparison summary",
  "recommendation": "When to use each tool",
  "scoringTable": {
    "tools": [
      {
        "name": "Tool Name",
        "slug": "tool-slug",
        "dimensions": {
          "Performance": { "score": 85, "confidence": "live_data" },
          "Ecosystem": { "score": 90, "confidence": "ai_inferred" },
          "Operational Complexity": { "score": 70, "confidence": "ai_inferred" },
          "Enterprise Readiness": { "score": 80, "confidence": "ai_inferred" },
          "Learning Curve": { "score": 75, "confidence": "ai_inferred" }
        },
        "totalScore": 80
      }
    ]
  },
  "decisionGuidance": {
    "choices": [
      {
        "toolName": "Tool Name",
        "chooseIf": ["Scenario where this tool excels"],
        "avoidIf": ["Scenario where this tool falls short"]
      }
    ],
    "migrationComplexity": "medium",
    "migrationNotes": "Notes on migrating between these tools"
  },
  "riskAnalysis": {
    "risks": [
      {
        "toolName": "Tool Name",
        "vendorLockIn": "low",
        "communityRisk": "low",
        "operationalRisk": "medium",
        "maturityRisk": "low",
        "notes": "Risk context"
      }
    ]
  },
  "confidenceScore": 82
}`;

    return { system, user };
  }

  /**
   * Deep-dive analysis of a single tool
   */
  async analyzeDeepDive(toolData: AggregatedToolData): Promise<DeepDiveAnalysis> {
    const prompt = this.generateDeepDivePrompt(toolData);

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: prompt.system,
        messages: [
          {
            role: 'user',
            content: prompt.user,
          },
        ],
      });

      const content = response.data.content[0].text;
      const analysis = JSON.parse(content) as DeepDiveAnalysis;

      // Enrich with real-time data + MCP verification badge
      return {
        ...analysis,
        githubUrl: toolData.github?.repository.url,
        githubRepo: toolData.github?.repository.fullName,
        metrics: toolData.github
          ? {
              stars: toolData.github.repository.stars,
              forks: toolData.github.repository.forks,
              downloads: toolData.community?.npm
                ? `${this.formatNumber(toolData.community.npm.downloads.lastMonth)}/month`
                : undefined,
              recentActivity: toolData.github.activity.recentCommits
                ? `${toolData.github.activity.recentCommits} commits (30 days)`
                : undefined,
            }
          : undefined,
        documentationUrl: toolData.docs?.url,
        lastUpdated: new Date().toISOString(),
        verificationBadge: toolData.mcpVerified && toolData.mcpOrgName && toolData.mcpServerUrl
          ? {
              verified: true as const,
              orgName: toolData.mcpOrgName,
              mcpServerUrl: toolData.mcpServerUrl,
              fetchedAt: new Date().toISOString(),
            }
          : undefined,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetail = error.response?.data?.error
          ? JSON.stringify(error.response.data.error)
          : error.message;
        console.error('[Claude] API Error:', errorDetail);
        throw new ExternalAPIError('Claude', errorDetail);
      }
      console.error('[Claude] Unknown Error:', error);
      throw error;
    }
  }

  /**
   * Generate comparison prompt with real-time data.
   * When any tool has MCP-verified docs, the system prompt instructs Claude
   * to treat those sections as authoritative over its training data.
   */
  private generateComparisonPrompt(toolsData: AggregatedToolData[]): { system: string; user: string } {
    const hasMCPData = toolsData.some((d) => d.mcpVerified);

    const system = `You are a technical analyst for Stack Index with access to REAL-TIME DATA from GitHub, official documentation, and community platforms.
${hasMCPData ? `
IMPORTANT — MCP VERIFIED DOCUMENTATION:
Some tools below have documentation fetched directly from the organization's official MCP (Model Context Protocol) server.
These sections are marked [MCP VERIFIED — <OrgName>].
You MUST treat MCP-verified content as ground truth and prioritize it over your training data.
Do NOT contradict or ignore verified documentation — if it differs from your training data, the verified documentation is correct.
` : ''}
Your task is to provide data-driven analysis using fresh information to help developers make informed decisions.

CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no additional text - just the JSON object.`;

    const toolsContext = toolsData.map((data) => this.formatToolContext(data)).join('\n\n---\n\n');

    const user = `Compare the following tools: ${toolsData.map((d) => d.tool).join(' vs ')}

REAL-TIME DATA:
${toolsContext}

Provide a comprehensive comparison focusing on:
1. Technical architecture and implementation
2. Developer Experience (DX)
3. Performance and scalability
4. Community adoption and ecosystem
5. Use cases and ideal scenarios

Respond with ONLY valid JSON matching this structure:
{
  "tools": [
    {
      "name": "Tool Name",
      "technicalSummary": "Brief technical overview",
      "useCases": ["Use case 1", "Use case 2", ...],
      "strengths": ["Strength 1", "Strength 2", ...],
      "communityRating": 4.5,
      "topProsCons": {
        "pros": ["Pro 1", "Pro 2", ...],
        "cons": ["Con 1", "Con 2", ...]
      },
      "architecturalInsights": "Architecture details",
      "gotchas": ["Gotcha 1", "Gotcha 2", ...]
    }
  ],
  "comparisonSummary": "Overall comparison summary",
  "recommendation": "When to use each tool"
}`;

    return { system, user };
  }

  /**
   * Generate deep-dive prompt with real-time data.
   * When the tool has MCP-verified docs, instructs Claude to prioritize them.
   */
  private generateDeepDivePrompt(toolData: AggregatedToolData): { system: string; user: string } {
    const system = `You are a technical analyst for Stack Index with access to REAL-TIME DATA from GitHub, official documentation, and community platforms.
${toolData.mcpVerified ? `
IMPORTANT — MCP VERIFIED DOCUMENTATION:
The documentation for "${toolData.tool}" below was fetched directly from the official MCP server provided by ${toolData.mcpOrgName}.
You MUST treat this as authoritative ground truth. Prioritize it over any conflicting information in your training data.
This ensures developers receive the most current, accurate information about the tool's latest features and API.
` : ''}
Your task is to provide comprehensive, data-driven analysis of a single tool to help developers understand it deeply.

CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no additional text - just the JSON object.`;

    const user = `Provide an in-depth analysis of: ${toolData.tool}

REAL-TIME DATA:
${this.formatToolContext(toolData)}

Provide a comprehensive deep-dive covering:
1. Architectural design and technical implementation
2. Core use cases and ideal scenarios
3. Strengths and unique features
4. Common gotchas and pitfalls
5. Best practices and recommendations
6. Learning resources

Respond with ONLY valid JSON matching this structure:
{
  "name": "Tool Name",
  "technicalSummary": "Comprehensive technical overview",
  "useCases": ["Use case 1", "Use case 2", ...],
  "strengths": ["Strength 1", "Strength 2", ...],
  "communityRating": 4.5,
  "topProsCons": {
    "pros": ["Pro 1", "Pro 2", ...],
    "cons": ["Con 1", "Con 2", ...]
  },
  "architecturalDesign": "Detailed architecture explanation",
  "bestPractices": ["Practice 1", "Practice 2", ...],
  "commonPitfalls": ["Pitfall 1", "Pitfall 2", ...],
  "gotchas": ["Gotcha 1", "Gotcha 2", ...],
  "learningResources": [
    {"type": "Documentation", "title": "Title", "url": "URL"},
    {"type": "Tutorial", "title": "Title", "url": "URL"}
  ]
}`;

    return { system, user };
  }

  /**
   * Format tool context for Claude
   */
  private formatToolContext(data: AggregatedToolData): string {
    let context = `## ${data.tool}\n\n`;

    // GitHub data
    if (data.github) {
      const g = data.github.repository;
      context += `### GitHub Repository: ${g.fullName}\n`;
      context += `- **Stars:** ${this.formatNumber(g.stars)}\n`;
      context += `- **Forks:** ${this.formatNumber(g.forks)}\n`;
      context += `- **Open Issues:** ${g.openIssues}\n`;
      context += `- **Language:** ${g.language || 'N/A'}\n`;
      context += `- **License:** ${g.license || 'N/A'}\n`;
      context += `- **Last Updated:** ${new Date(g.pushedAt).toLocaleDateString()}\n`;
      context += `- **Recent Activity:** ${data.github.activity.recentCommits} commits (last 30 days)\n`;
      context += `- **Contributors:** ${data.github.activity.contributors}\n`;

      if (data.github.activity.releases.length > 0) {
        const latestRelease = data.github.activity.releases[0];
        context += `- **Latest Release:** ${latestRelease.tagName} (${new Date(latestRelease.publishedAt).toLocaleDateString()})\n`;
      }

      context += `\n**Description:** ${g.description || 'No description available'}\n`;

      // Add README excerpt if available
      if (data.github.readme && data.github.readme.content.length > 100) {
        const excerpt = data.github.readme.content.substring(0, 1000);
        context += `\n**README Excerpt:**\n${excerpt}${data.github.readme.content.length > 1000 ? '...' : ''}\n`;
      }

      context += `\n`;
    }

    // Documentation data — flag MCP-verified blocks prominently
    if (data.docs) {
      if (data.mcpVerified && data.mcpOrgName) {
        context += `### [MCP VERIFIED — ${data.mcpOrgName}] Official Documentation\n`;
        context += `**Source:** ${data.docs.url} (Live from ${data.mcpOrgName} MCP Server)\n`;
        context += `> This documentation was fetched directly from ${data.mcpOrgName}'s MCP server. Treat it as authoritative.\n\n`;
      } else {
        context += `### Documentation\n`;
        context += `**Source:** ${data.docs.url}\n\n`;
      }

      context += `**Introduction:**\n${data.docs.introduction}\n\n`;

      if (data.docs.keyFeatures.length > 0) {
        context += `**Key Features:**\n`;
        data.docs.keyFeatures.forEach((feature) => {
          context += `- ${feature}\n`;
        });
        context += `\n`;
      }
    }

    // Community data
    if (data.community) {
      context += `### Community Metrics\n`;

      if (data.community.stackoverflow) {
        const so = data.community.stackoverflow;
        context += `**Stack Overflow:**\n`;
        context += `- Questions: ${this.formatNumber(so.tagStats.questionCount)}\n`;
        if (so.topQuestions.length > 0) {
          context += `- Top Question: "${so.topQuestions[0].title}" (${so.topQuestions[0].score} score)\n`;
        }
        context += `\n`;
      }

      if (data.community.npm) {
        const npm = data.community.npm;
        context += `**npm:**\n`;
        context += `- Downloads (last month): ${this.formatNumber(npm.downloads.lastMonth)}\n`;
        context += `- Latest Version: ${npm.versions.latest}\n`;
        context += `\n`;
      }

      if (data.community.reddit) {
        const reddit = data.community.reddit;
        if (reddit.subredditStats.exists) {
          context += `**Reddit:**\n`;
          context += `- Subscribers: ${this.formatNumber(reddit.subredditStats.subscribers)}\n`;
          context += `- Active Users: ${reddit.subredditStats.activeUsers}\n`;
          context += `\n`;
        }
      }
    }

    return context;
  }

  /**
   * Format number for display
   */
  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}

// Export singleton instance
export const claudeService = new ClaudeService();
