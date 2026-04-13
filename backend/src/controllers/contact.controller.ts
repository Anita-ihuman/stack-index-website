import { Request, Response } from 'express';
import { sendContactEmail } from '../services/email.service';

export const submitContact = async (req: Request, res: Response) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: firstName, email, message' });
  }

  try {
    const info = await sendContactEmail({ firstName, lastName, email, message });
    return res.status(200).json({ ok: true, info });
  } catch (error: any) {
    console.error('[Contact] Failed to send email:', error?.message || error);
    console.error('[Contact] Full error:', JSON.stringify(error, null, 2));
    return res.status(500).json({ error: 'Failed to send contact email', detail: error?.message });
  }
};
