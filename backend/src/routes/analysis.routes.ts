import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';
import { analysisRateLimiter } from '../middleware/rateLimiter';
import { validateAnalyzeRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorMiddleware';

const router = Router();

/**
 * POST /api/analyze
 * Main analysis endpoint with rate limiting and validation
 */
router.post(
  '/analyze',
  analysisRateLimiter,
  validateAnalyzeRequest,
  asyncHandler((req, res, next) => analysisController.analyze(req, res, next))
);

/**
 * POST /api/prefetch
 * Prefetch common tools (no rate limiting for admin use)
 */
router.post('/prefetch', asyncHandler((req, res, next) => analysisController.prefetch(req, res, next)));

export default router;
