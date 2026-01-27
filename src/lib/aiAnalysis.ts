import { AnalysisRequest, ComparisonAnalysis, DeepDiveAnalysis } from '@/types/analysis';
import { analysisApi, AnalysisMetadata } from './apiClient';

// Parse the input to detect if it's multiple tools or a single tool
export function detectAnalysisType(input: string): 'comparison' | 'deepdive' {
  const separators = [' vs ', ' vs. ', ',', ' and ', ' or '];
  const hasMultipleTools = separators.some(sep =>
    input.toLowerCase().includes(sep)
  );

  return hasMultipleTools ? 'comparison' : 'deepdive';
}

// Generate prompts based on analysis type
export function generateFoStackPrompt(input: string): { systemPrompt: string; userPrompt: string; type: 'comparison' | 'deepdive' } {
  const type = detectAnalysisType(input);

  if (type === 'comparison') {
    const systemPrompt = `You are a technical analyst for the Fo Stack Index, specializing in developer tools and infrastructure.

Your task is to compare developer tools objectively based on:
1. Technical architecture and implementation
2. Developer Experience (DX)
3. Performance and scalability
4. Community adoption and ecosystem
5. Use cases and ideal scenarios

Synthesize community ratings based on your training data including GitHub stars, NPM downloads, Stack Overflow activity, and developer sentiment.

CRITICAL: You must respond with ONLY valid JSON. No additional text before or after. The JSON must follow this exact structure:

{
  "tools": [
    {
      "name": "Tool Name",
      "technicalSummary": "Brief technical overview",
      "useCases": ["use case 1", "use case 2"],
      "strengths": ["strength 1", "strength 2"],
      "communityRating": 4.5,
      "topProsCons": {
        "pros": ["pro 1", "pro 2"],
        "cons": ["con 1", "con 2"]
      },
      "architecturalInsights": "Key architectural details"
    }
  ],
  "comparisonSummary": "Overall comparison summary",
  "recommendation": "Contextual recommendation"
}`;

    const userPrompt = `Compare the following developer tools: ${input}

Provide a comprehensive comparison including technical details, DX considerations, and community metrics. Return only valid JSON matching the specified structure.`;

    return { systemPrompt, userPrompt, type };
  } else {
    const systemPrompt = `You are a technical analyst for the Fo Stack Index, specializing in developer tools and infrastructure.

Your task is to provide a deep-dive analysis of a single developer tool or project, covering:
1. Architectural design and technical implementation
2. Core use cases and ideal scenarios
3. Strengths and unique features
4. Common gotchas and pitfalls
5. Best practices and recommendations
6. Learning resources

Synthesize community ratings based on your training data including GitHub stars, NPM downloads, Stack Overflow activity, and developer sentiment.

CRITICAL: You must respond with ONLY valid JSON. No additional text before or after. The JSON must follow this exact structure:

{
  "name": "Tool Name",
  "technicalSummary": "Brief technical overview",
  "useCases": ["use case 1", "use case 2"],
  "strengths": ["strength 1", "strength 2"],
  "communityRating": 4.5,
  "topProsCons": {
    "pros": ["pro 1", "pro 2"],
    "cons": ["con 1", "con 2"]
  },
  "detailedArchitecture": "Comprehensive architectural analysis",
  "bestPractices": ["practice 1", "practice 2"],
  "commonPitfalls": ["pitfall 1", "pitfall 2"],
  "learningResources": ["resource 1", "resource 2"],
  "gotchas": ["gotcha 1", "gotcha 2"]
}`;

    const userPrompt = `Provide a comprehensive deep-dive analysis of: ${input}

Include technical architecture, use cases, strengths, gotchas, best practices, and learning resources. Return only valid JSON matching the specified structure.`;

    return { systemPrompt, userPrompt, type };
  }
}

/**
 * Enhanced analysis response with metadata
 */
export interface EnhancedAnalysisResponse {
  analysis: ComparisonAnalysis | DeepDiveAnalysis;
  metadata?: AnalysisMetadata;
}

/**
 * Analyze tools using backend API (with fallback to direct Claude calls)
 */
export async function analyzeTools(request: AnalysisRequest): Promise<EnhancedAnalysisResponse> {
  const useBackend = import.meta.env.VITE_USE_BACKEND !== 'false';

  if (useBackend) {
    try {
      console.log('[Analysis] Using backend API for real-time data fetching');
      const type = request.type || detectAnalysisType(request.input);
      const response = await analysisApi.analyze<ComparisonAnalysis | DeepDiveAnalysis>(
        request.input,
        type,
        request.options
      );

      return {
        analysis: response.analysis,
        metadata: response.metadata,
      };
    } catch (error) {
      // Backend failed — do NOT call Claude directly from the browser (CORS + API key exposure).
      // Surface a clear error so the developer can fix the backend deployment/configuration.
      console.error('[Analysis] Backend API error — aborting and surfacing error to UI:', error);
      throw new Error(
        'Backend analysis request failed. Ensure the backend is running, VITE_BACKEND_URL is correct, and the backend has ANTHROPIC_API_KEY configured. Check backend logs for details.'
      );
    }
  }

  return await analyzeToolsDirect(request);
}

/**
 * Direct Claude API calls (fallback method without real-time data)
 */
async function analyzeToolsDirect(request: AnalysisRequest): Promise<EnhancedAnalysisResponse> {
  const { systemPrompt, userPrompt } = generateFoStackPrompt(request.input);

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not configured. Please add it to your .env file.');
  }

  try {
    console.log('[Analysis] Using direct Claude API (no real-time data)');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse the JSON response
    const analysisResult = JSON.parse(content);

    return {
      analysis: analysisResult,
      metadata: undefined, // No metadata for direct calls
    };
  } catch (error) {
    console.error('Error analyzing tools:', error);
    throw error;
  }
}
