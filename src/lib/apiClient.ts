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
  };
  fetchedAt: string;
  tokensUsed: number;
  dataAge: {
    github?: string;
    docs?: string;
    community?: string;
  };
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
