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
  recommendation?: string;
}

export interface DeepDiveAnalysis extends ToolAnalysis {
  detailedArchitecture: string;
  bestPractices: string[];
  commonPitfalls: string[];
  learningResources: string[];
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