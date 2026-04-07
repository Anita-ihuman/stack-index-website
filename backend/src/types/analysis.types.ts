/**
 * Shared types for analysis (used by backend and can be shared with frontend)
 */

// ---------------------------------------------------------------------------
// MCP Verification
// ---------------------------------------------------------------------------

/**
 * Attached to any tool result whose documentation was sourced from a
 * registered MCP server rather than scraped or inferred from training data.
 */
export interface VerificationBadge {
  /** Always true when this object is present */
  verified: true;
  /** Display name of the organization that provided the MCP server */
  orgName: string;
  /** Base URL of the MCP server used (for transparency) */
  mcpServerUrl: string;
  /** ISO timestamp of when the data was fetched from the MCP server */
  fetchedAt: string;
}

export interface AnalysisRequest {
  input: string;
  type: 'comparison' | 'deepdive';
  options?: {
    skipCache?: boolean;
    includeMetrics?: boolean;
  };
}

export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface ToolAnalysis {
  name: string;
  technicalSummary: string;
  useCases: string[];
  strengths: string[];
  communityRating: number;
  topProsCons: ProsCons;
  architecturalInsights?: string;
  gotchas?: string[];

  // Real-time data fields
  githubUrl?: string;
  githubRepo?: string;
  metrics?: {
    stars: number;
    forks: number;
    downloads?: string;
    recentActivity?: string;
  };
  documentationUrl?: string;
  lastUpdated?: string;

  /** Present when documentation was sourced from an org's MCP server */
  verificationBadge?: VerificationBadge;
}

export interface ComparisonAnalysis {
  tools: ToolAnalysis[];
  comparisonSummary: string;
  recommendation: string;
}

export interface DeepDiveAnalysis {
  name: string;
  technicalSummary: string;
  useCases: string[];
  strengths: string[];
  communityRating: number;
  topProsCons: ProsCons;
  architecturalDesign: string;
  bestPractices: string[];
  commonPitfalls: string[];
  gotchas: string[];
  learningResources: Array<{
    type: string;
    title: string;
    url: string;
  }>;

  // Real-time data fields
  githubUrl?: string;
  githubRepo?: string;
  metrics?: {
    stars: number;
    forks: number;
    downloads?: string;
    recentActivity?: string;
  };
  documentationUrl?: string;
  lastUpdated?: string;

  /** Present when documentation was sourced from an org's MCP server */
  verificationBadge?: VerificationBadge;
}

export interface AnalysisMetadata {
  sources: {
    github: boolean;
    documentation: boolean;
    community: boolean;
    /** True when at least one tool's docs came from an MCP server */
    mcp: boolean;
  };
  fetchedAt: string;
  tokensUsed: number;
  dataAge: {
    github?: string;
    docs?: string;
    community?: string;
  };
  /** List of tool slugs whose docs were sourced from MCP servers */
  mcpVerifiedTools?: string[];
  /** Tools that had an MCP server registered but the fetch failed (fell back to scraping) */
  mcpFallbackTools?: string[];
}

export interface AnalysisResponse {
  analysis: ComparisonAnalysis | DeepDiveAnalysis;
  metadata: AnalysisMetadata;
}

// ---------------------------------------------------------------------------
// Enhanced Comparison types (Phase 2)
// ---------------------------------------------------------------------------

import { DataConfidence } from './catalog.types';

export interface ComparisonScoringTableRow {
  name: string;
  slug: string;
  dimensions: Record<string, { score: number | null; confidence: DataConfidence }>;
  totalScore: number | null;
}

export interface ComparisonScoringTable {
  tools: ComparisonScoringTableRow[];
}

export interface DecisionChoice {
  toolName: string;
  chooseIf: string[];
  avoidIf: string[];
}

export interface DecisionGuidance {
  choices: DecisionChoice[];
  migrationComplexity: 'low' | 'medium' | 'high';
  migrationNotes: string;
}

export interface ToolRisk {
  toolName: string;
  vendorLockIn: 'low' | 'medium' | 'high';
  communityRisk: 'low' | 'medium' | 'high';
  operationalRisk: 'low' | 'medium' | 'high';
  maturityRisk: 'low' | 'medium' | 'high';
  notes: string;
}

export interface RiskAnalysis {
  risks: ToolRisk[];
}

export interface EnhancedComparisonAnalysis extends ComparisonAnalysis {
  scoringTable?: ComparisonScoringTable;
  decisionGuidance?: DecisionGuidance;
  riskAnalysis?: RiskAnalysis;
  confidenceScore?: number;
}
