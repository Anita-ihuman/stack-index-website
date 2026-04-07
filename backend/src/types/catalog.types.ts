export type ToolCategory =
  | 'container-orchestration'
  | 'cicd'
  | 'observability'
  | 'infrastructure-as-code'
  | 'service-mesh-networking'
  | 'databases'
  | 'message-queue'
  | 'frontend-frameworks'
  | 'backend-frameworks'
  | 'security'
  | 'data-analytics'
  | 'developer-tools';

export type DataConfidence = 'live_data' | 'cached' | 'ai_inferred';

export interface ToolCatalogEntry {
  slug: string;
  name: string;
  category: ToolCategory;
  subcategory: string;
  description: string;
  coreArchitectureModel: string;
  primaryUseCases: string[];
  bestFitFor: string[];
  notIdealFor: string[];
  deploymentModel: 'self-hosted' | 'cloud' | 'saas' | 'hybrid';
  pricingModel: 'free' | 'paid' | 'freemium' | 'enterprise' | 'open-source';
  license: string;
  keyIntegrations: string[];
  operationalComplexity: 'low' | 'medium' | 'high';
  scalabilityProfile: string;
  ecosystemStrength: string;
  alternatives: string[];
  maturityLevel: 'emerging' | 'growing' | 'mature' | 'legacy';
  githubRepo?: string;
  website: string;
  docsUrl: string;
  tags: string[];
}

export interface ScoredDimension {
  raw: number | null;
  normalized: number;
  weight: number;
  confidence: DataConfidence;
  lastFetchedAt: string;
}

export interface ToolScore {
  slug: string;
  overall: number;
  dimensions: {
    githubStars: ScoredDimension;
    contributorVelocity: ScoredDimension;
    issueResolutionSpeed: ScoredDimension;
    documentationQuality: ScoredDimension;
    downloadVolume: ScoredDimension;
    communityActivity: ScoredDimension;
    enterpriseAdoption: ScoredDimension;
    maintenanceHealth: ScoredDimension;
  };
  dataConfidence: DataConfidence;
  computedAt: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
  category?: ToolCategory;
}

export interface SearchResult {
  rank: number;
  toolSlug: string;
  toolName: string;
  relevanceScore: number;
  matchReason: string;
  tradeoffs?: string;
  dataConfidence: DataConfidence;
}

export interface SearchResponse {
  query: string;
  intent: 'find_tool' | 'compare_tools' | 'browse_category' | 'get_recommendation';
  constraints: {
    budget?: 'free' | 'paid' | 'any';
    scale?: string;
    existingStack?: string[];
    category?: string;
  };
  results: SearchResult[];
  summary: string;
  searchedAt: string;
}
