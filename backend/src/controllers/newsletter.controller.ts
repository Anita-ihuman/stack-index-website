import { Request, Response } from 'express';
import { addSubscriber, syncAllToBrevo } from '../services/newsletter.service';

export const subscribe = async (req: Request, res: Response) => {
  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ error: 'email and firstName are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const result = await addSubscriber(email, firstName, req.body.source ?? 'homepage');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Newsletter] Failed to save subscriber:', error?.message);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
};

/**
 * POST /api/newsletter/sync-brevo
 * One-time backfill — syncs all local subscribers to Brevo.
 * Should be called once after setting BREVO_API_KEY.
 */
export const syncBrevo = async (_req: Request, res: Response) => {
  try {
    const result = await syncAllToBrevo();
    return res.status(200).json({ ok: true, ...result });
  } catch (error: any) {
    console.error('[Newsletter] Brevo bulk sync failed:', error?.message);
    return res.status(500).json({ error: 'Brevo sync failed' });
  }
};
