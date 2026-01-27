import NodeCache from 'node-cache';
import { getRedisClient } from '../config/redis';

/**
 * Cache TTLs (in seconds)
 */
export const CACHE_TTLS = {
  github: {
    metrics: 15 * 60, // 15 minutes
    readme: 60 * 60, // 1 hour
    activity: 5 * 60, // 5 minutes
  },
  documentation: {
    content: 24 * 60 * 60, // 24 hours
    quickRef: 12 * 60 * 60, // 12 hours
  },
  community: {
    stackoverflow: 60 * 60, // 1 hour
    reddit: 30 * 60, // 30 minutes
    npm: 60 * 60, // 1 hour
  },
  analysis: {
    complete: 6 * 60 * 60, // 6 hours
  },
};

/**
 * In-memory cache fallback using node-cache
 */
const memoryCache = new NodeCache({
  stdTTL: 600, // Default 10 minutes
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Don't clone objects for better performance
});

/**
 * Cache service with Redis primary and in-memory fallback
 */
export class CacheService {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();

    try {
      // Try Redis first
      if (redis && redis.status === 'ready') {
        const value = await redis.get(key);
        if (value) {
          try {
            return JSON.parse(value) as T;
          } catch {
            return value as T;
          }
        }
      }

      // Fallback to memory cache
      const memValue = memoryCache.get<T>(key);
      return memValue || null;
    } catch (error) {
      console.error(`[Cache] Error getting key "${key}":`, error);
      // Try memory cache as last resort
      const memValue = memoryCache.get<T>(key);
      return memValue || null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: any, ttl: number): Promise<void> {
    const redis = getRedisClient();

    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      // Set in Redis if available
      if (redis && redis.status === 'ready') {
        await redis.setex(key, ttl, stringValue);
      }

      // Always set in memory cache as fallback
      memoryCache.set(key, value, ttl);
    } catch (error) {
      console.error(`[Cache] Error setting key "${key}":`, error);
      // Ensure memory cache is set even if Redis fails
      memoryCache.set(key, value, ttl);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    const redis = getRedisClient();

    try {
      if (redis && redis.status === 'ready') {
        await redis.del(key);
      }
      memoryCache.del(key);
    } catch (error) {
      console.error(`[Cache] Error deleting key "${key}":`, error);
      memoryCache.del(key);
    }
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    const redis = getRedisClient();

    try {
      if (redis && redis.status === 'ready') {
        const exists = await redis.exists(key);
        return exists === 1;
      }
      return memoryCache.has(key);
    } catch (error) {
      console.error(`[Cache] Error checking key "${key}":`, error);
      return memoryCache.has(key);
    }
  }

  /**
   * Get multiple keys at once
   */
  async getMany<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};

    await Promise.all(
      keys.map(async (key) => {
        result[key] = await this.get<T>(key);
      })
    );

    return result;
  }

  /**
   * Set multiple keys at once
   */
  async setMany(items: Array<{ key: string; value: any; ttl: number }>): Promise<void> {
    await Promise.all(items.map((item) => this.set(item.key, item.value, item.ttl)));
  }

  /**
   * Clear all cache (use with caution)
   */
  async clear(): Promise<void> {
    const redis = getRedisClient();

    try {
      if (redis && redis.status === 'ready') {
        await redis.flushdb();
      }
      memoryCache.flushAll();
      console.log('[Cache] All cache cleared');
    } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
      memoryCache.flushAll();
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memory: memoryCache.getStats(),
      redis: getRedisClient() ? 'connected' : 'disconnected',
    };
  }

  /**
   * Generate cache key for GitHub data
   */
  static githubKey(repo: string, type: 'metrics' | 'readme' | 'activity'): string {
    return `github:${repo}:${type}`;
  }

  /**
   * Generate cache key for documentation
   */
  static docsKey(tool: string, type: 'content' | 'quickRef'): string {
    return `docs:${tool}:${type}`;
  }

  /**
   * Generate cache key for community data
   */
  static communityKey(tool: string, source: 'stackoverflow' | 'reddit' | 'npm'): string {
    return `community:${tool}:${source}`;
  }

  /**
   * Generate cache key for complete analysis
   */
  static analysisKey(input: string, type: 'comparison' | 'deepdive'): string {
    // Normalize input for consistent cache keys
    const normalized = input.toLowerCase().trim().replace(/\s+/g, '-');
    return `analysis:${type}:${normalized}`;
  }
}

// Export singleton instance
export const cacheService = new CacheService();
