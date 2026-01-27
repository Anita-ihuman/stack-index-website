import { Request, Response, NextFunction } from 'express';
import { orchestratorService, detectAnalysisType } from '../services/orchestrator.service';
import { AnalysisRequest } from '../types/analysis.types';

/**
 * Analysis Controller
 */
export class AnalysisController {
  /**
   * POST /api/analyze
   * Main analysis endpoint with real-time data fetching
   */
  async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { input, type: requestedType }: AnalysisRequest = req.body;

      console.log(`[Controller] Analysis request:`, {
        input,
        requestedType,
        ip: req.ip,
      });

      // Detect type if not provided
      const type = requestedType || detectAnalysisType(input);

      // Perform analysis
      const result = await orchestratorService.analyze(input, type);

      // Set cache header for rate limiting skip
      if (result.metadata.sources.github || result.metadata.sources.documentation) {
        res.setHeader('X-Cache-Status', 'hit');
      }

      // Send response
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analyze/prefetch
   * Prefetch common tools (warmup cache)
   */
  async prefetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tools = req.body.tools || [
        'React',
        'Vue',
        'Next.js',
        'Angular',
        'Svelte',
        'TypeScript',
        'Vite',
        'Express',
      ];

      // Don't await - run in background
      orchestratorService.prefetchCommonTools(tools).catch((error) => {
        console.error('[Controller] Prefetch error:', error);
      });

      res.json({
        message: 'Prefetch started',
        tools,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const analysisController = new AnalysisController();
