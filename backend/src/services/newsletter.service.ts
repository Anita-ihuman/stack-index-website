import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BrevoClient } from '@getbrevo/brevo';

const DATA_PATH = path.join(__dirname, '../../data/subscribers.json');

// Ensure the data directory and file exist on first run (e.g. fresh Render deploy)
const ensureDataFile = () => {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ subscribers: [] }, null, 2), 'utf-8');
};
ensureDataFile();

type Subscriber = {
  id: string;
  email: string;
  firstName: string;
  subscribedAt: string;
  source: string;
};

const readSubscribers = (): Subscriber[] => {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw).subscribers ?? [];
  } catch {
    return [];
  }
};

const writeSubscribers = (subscribers: Subscriber[]) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ subscribers }, null, 2), 'utf-8');
};

/**
 * Add a contact to Brevo and optionally to a list.
 * Fires-and-forgets — local JSON save is not blocked by Brevo failures.
 */
const syncToBrevo = async (email: string, firstName: string): Promise<void> => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[Newsletter] BREVO_API_KEY not set — skipping Brevo sync');
    return;
  }

  const listId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID, 10) : undefined;

  try {
    const client = new BrevoClient({ apiKey });

    await client.contacts.createContact({
      email,
      attributes: { FIRSTNAME: firstName },
      listIds: listId ? [listId] : undefined,
      updateEnabled: true, // update if contact already exists
    });

    console.log(`[Newsletter] Synced ${email} to Brevo`);
  } catch (err: any) {
    // Log but don't throw — local save already succeeded
    console.error('[Newsletter] Brevo sync failed:', err?.message ?? err);
  }
};

export const addSubscriber = async (
  email: string,
  firstName: string,
  source = 'homepage'
): Promise<{ ok: boolean; alreadySubscribed: boolean }> => {
  const subscribers = readSubscribers();
  const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    // Still try to sync to Brevo in case this person wasn't previously synced
    syncToBrevo(email.toLowerCase().trim(), firstName.trim());
    return { ok: true, alreadySubscribed: true };
  }

  subscribers.push({
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    firstName: firstName.trim(),
    subscribedAt: new Date().toISOString(),
    source,
  });

  writeSubscribers(subscribers);

  // Fire-and-forget Brevo sync (non-blocking)
  syncToBrevo(email.toLowerCase().trim(), firstName.trim());

  return { ok: true, alreadySubscribed: false };
};

export const getSubscriberCount = (): number => readSubscribers().length;

/**
 * Sync all existing local subscribers to Brevo.
 * Call this once from a script or admin endpoint to backfill.
 */
export const syncAllToBrevo = async (): Promise<{ synced: number; failed: number }> => {
  const subscribers = readSubscribers();
  let synced = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      await syncToBrevo(sub.email, sub.firstName);
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed };
};
