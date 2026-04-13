import axios, { AxiosError } from 'axios';

/**
 * Backend API base URL
 */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

/**
 * Axios client for backend communication
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config) => {
    // Could add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis request timed out. Please try again.');
    }

    if (!error.response) {
      throw new Error('Unable to connect to analysis service. Please ensure the backend is running.');
    }

    // Handle API errors
    const errorMessage = error.response.data?.error || error.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
);

/**
 * Analysis request interface
 */
export interface AnalysisRequest {
  input: string;
  type: 'comparison' | 'deepdive';
  options?: {
    skipCache?: boolean;
    includeMetrics?: boolean;
  };
}

/**
 * Analysis metadata interface
 */
export interface AnalysisMetadata {
  sources: {
    github: boolean;
    documentation: boolean;
    community: boolean;
    /** True when at least one tool used an MCP server for docs */
    mcp: boolean;
  };
  fetchedAt: string;
  tokensUsed: number;
  dataAge: {
    github?: string;
    docs?: string;
    community?: string;
  };
  /** Tool slugs whose docs were fetched from a verified MCP server */
  mcpVerifiedTools?: string[];
  /** Tools that had MCP registered but fetch failed and fell back to scraping */
  mcpFallbackTools?: string[];
}

/**
 * Analysis response interface
 */
export interface AnalysisResponse<T> {
  analysis: T;
  metadata: AnalysisMetadata;
}

/**
 * Health check response interface
 */
export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    redis: boolean;
    github: boolean;
    claude: boolean;
  };
  version: string;
  environment: string;
  timestamp: string;
}

/**
 * Catalog + Search API functions
 */
import type { ToolCatalogEntry, ToolScore, SearchResponse, ToolCategory } from '@/types/catalog';

export const catalogApi = {
  async listTools(params?: { category?: ToolCategory }): Promise<{ tools: ToolCatalogEntry[]; count: number }> {
    const url = params?.category ? `/tools?category=${params.category}` : '/tools';
    const res = await apiClient.get<{ tools: ToolCatalogEntry[]; count: number }>(url);
    return res.data;
  },

  async listCategories(): Promise<{ categories: Array<{ category: ToolCategory; count: number; tools: string[] }> }> {
    const res = await apiClient.get<{ categories: Array<{ category: ToolCategory; count: number; tools: string[] }> }>('/tools/categories');
    return res.data;
  },

  async getTool(slug: string, withScore = false): Promise<{ tool: ToolCatalogEntry; score?: ToolScore }> {
    const url = withScore ? `/tools/${slug}?score=true` : `/tools/${slug}`;
    const res = await apiClient.get<{ tool: ToolCatalogEntry; score?: ToolScore }>(url);
    return res.data;
  },

  async getToolScore(slug: string): Promise<{ slug: string; score: ToolScore }> {
    const res = await apiClient.get<{ slug: string; score: ToolScore }>(`/tools/${slug}/score`);
    return res.data;
  },

  async search(query: string, options?: { limit?: number; category?: ToolCategory }): Promise<SearchResponse> {
    const res = await apiClient.post<SearchResponse>('/search', {
      query,
      limit: options?.limit ?? 5,
      category: options?.category,
    });
    return res.data;
  },
};

/**
 * Newsletter subscription API
 */
export const newsletterApi = {
  async subscribe(data: { email: string; firstName: string; source?: string }) {
    const res = await apiClient.post<{ ok: boolean; alreadySubscribed: boolean }>('/newsletter/subscribe', data);
    return res.data;
  },
};

/**
 * Contact form API
 */
export const contactApi = {
  async submit(data: { firstName: string; lastName: string; email: string; message: string }) {
    const res = await apiClient.post<{ ok: boolean }>('/contact', data);
    return res.data;
  },
};

/**
 * Analysis API functions
 */
export const analysisApi = {
  /**
   * Analyze tools (comparison or deep-dive)
   */
  async analyze<T>(input: string, type: 'comparison' | 'deepdive', options = {}): Promise<AnalysisResponse<T>> {
    const response = await apiClient.post<AnalysisResponse<T>>('/analyze', {
      input,
      type,
      options,
    });
    return response.data;
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};
