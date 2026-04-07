import { Router } from 'express';
import { catalogController } from '../controllers/catalog.controller';
import { analysisRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Catalog endpoints (no auth, general rate limiting applied at /api level)
router.get('/tools/categories', catalogController.listCategories);
router.get('/tools/:slug/score', catalogController.getToolScore);
router.get('/tools/:slug', catalogController.getTool);
router.get('/tools', catalogController.listTools);

// Search uses Claude — apply tighter rate limiting
router.post('/search', analysisRateLimiter, catalogController.search);

export default router;
