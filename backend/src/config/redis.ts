import Redis from 'ioredis';
import { env, isRedisEnabled } from './environment';

let redisClient: Redis | null = null;

/**
 * Initialize Redis client with connection handling
 */
export const initializeRedis = (): Redis | null => {
  if (!isRedisEnabled()) {
    console.log('[Redis] Caching disabled or Redis URL not configured. Using in-memory fallback.');
    return null;
  }

  try {
    const client = new Redis(env.REDIS_URL, {
      password: env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    // Connection event handlers
    client.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    client.on('ready', () => {
      console.log('[Redis] Ready to accept commands');
    });

    client.on('error', (error) => {
      console.error('[Redis] Connection error:', error.message);
    });

    client.on('close', () => {
      console.log('[Redis] Connection closed');
    });

    // Attempt to connect
    client.connect().catch((error) => {
      console.error('[Redis] Failed to connect:', error.message);
      console.log('[Redis] Will use in-memory cache fallback');
    });

    redisClient = client;
    return client;
  } catch (error) {
    console.error('[Redis] Initialization error:', error);
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): Redis | null => {
  return redisClient;
};

/**
 * Check if Redis is connected and ready
 */
export const isRedisConnected = async (): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.ping();
    return true;
  } catch {
    return false;
  }
};

/**
 * Gracefully close Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
