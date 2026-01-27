/**
 * Shared types for analysis (used by backend and can be shared with frontend)
 */

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
}

export interface AnalysisMetadata {
  sources: {
    github: boolean;
    documentation: boolean;
    community: boolean;
  };
  fetchedAt: string;
  tokensUsed: number;
  dataAge: {
    github?: string;
    docs?: string;
    community?: string;
  };
}

export interface AnalysisResponse {
  analysis: ComparisonAnalysis | DeepDiveAnalysis;
  metadata: AnalysisMetadata;
}
