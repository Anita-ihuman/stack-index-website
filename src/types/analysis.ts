export interface ProsCons {
  pros: string[];
  cons: string[];
}

/**
 * Attached to any tool whose documentation came from an org's MCP server.
 * Displayed as a "Verified" badge in the UI.
 */
export interface VerificationBadge {
  verified: true;
  orgName: string;
  mcpServerUrl: string;
  fetchedAt: string;
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

  /** Present when documentation came from an org's verified MCP server */
  verificationBadge?: VerificationBadge;
}

export interface ComparisonAnalysis {
  tools: ToolAnalysis[];
  comparisonSummary: string;
  recommendation?: string;
}

export interface LearningResource {
  type: string;
  title: string;
  url: string;
}

export interface DeepDiveAnalysis extends ToolAnalysis {
  architecturalDesign: string;
  bestPractices: string[];
  commonPitfalls: string[];
  learningResources: LearningResource[];
}

export type AnalysisResult = ComparisonAnalysis | DeepDiveAnalysis;

export interface AnalysisRequest {
  input: string;
  type?: 'comparison' | 'deepdive';
  options?: {
    skipCache?: boolean;
    includeMetrics?: boolean;
  };
}

// ---------------------------------------------------------------------------
// Enhanced Comparison types (mirrors backend analysis.types.ts)
// ---------------------------------------------------------------------------

export type DataConfidence = 'live_data' | 'cached' | 'ai_inferred';

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