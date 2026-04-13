import { Router } from 'express';
import { subscribe, syncBrevo } from '../controllers/newsletter.controller';

const router = Router();

// POST /api/newsletter/subscribe
router.post('/newsletter/subscribe', subscribe);

// POST /api/newsletter/sync-brevo  — one-time backfill of local subscribers to Brevo
router.post('/newsletter/sync-brevo', syncBrevo);

export default router;
