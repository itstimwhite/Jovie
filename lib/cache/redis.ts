import { Redis } from '@upstash/redis';
import { env } from '@/lib/env';

// Default TTL values in seconds
export const CACHE_TTL = {
  PROFILE: 3600, // 1 hour
  SOCIAL_LINKS: 3600, // 1 hour
  POPULAR_PROFILES: 86400, // 24 hours
  API_RESPONSE: 300, // 5 minutes
  EDGE: 300, // 5 minutes for edge caching
};

/**
 * Redis cache client for application-level caching
 * Uses Upstash Redis for serverless Redis functionality
 */
export class RedisCache {
  private static instance: RedisCache;
  private redis: Redis | null = null;
  private enabled = false;

  private constructor() {
    // Initialize Redis client if environment variables are available
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        this.redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });
        this.enabled = true;
      } catch (error) {
        console.error('Failed to initialize Redis client:', error);
        this.enabled = false;
      }
    } else {
      // Redis is not configured, cache will be disabled
      this.enabled = false;
    }
  }

  /**
   * Get the singleton instance of RedisCache
   */
  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  /**
   * Check if Redis cache is enabled
   */
  public isEnabled(): boolean {
    return this.enabled && this.redis !== null;
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled()) return null;

    try {
      const value = await this.redis!.get(key);
      return value as T;
    } catch (error) {
      console.error(`Redis cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in the cache with optional TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      if (ttl) {
        await this.redis!.setex(key, ttl, value);
      } else {
        await this.redis!.set(key, value);
      }
    } catch (error) {
      console.error(`Redis cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete a value from the cache
   * @param key Cache key
   */
  public async del(key: string): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      await this.redis!.del(key);
    } catch (error) {
      console.error(`Redis cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple values from the cache using a pattern
   * @param pattern Key pattern to match (e.g., "profile:*")
   */
  public async delByPattern(pattern: string): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      const keys = await this.redis!.keys(pattern);
      if (keys.length > 0) {
        await this.redis!.del(...keys);
      }
    } catch (error) {
      console.error(
        `Redis cache delete by pattern error for ${pattern}:`,
        error
      );
    }
  }

  /**
   * Get multiple values from the cache
   * @param keys Array of cache keys
   * @returns Object with key-value pairs
   */
  public async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
    if (!this.isEnabled() || keys.length === 0) return {};

    try {
      const values = await this.redis!.mget(...keys);
      return keys.reduce(
        (acc, key, index) => {
          acc[key] = values[index] as T | null;
          return acc;
        },
        {} as Record<string, T | null>
      );
    } catch (error) {
      console.error(`Redis cache mget error:`, error);
      return {};
    }
  }

  /**
   * Set multiple values in the cache
   * @param entries Array of [key, value, ttl?] tuples
   */
  public async mset(entries: [string, unknown, number?][]): Promise<void> {
    if (!this.isEnabled() || entries.length === 0) return;

    try {
      // Group entries by TTL for batch processing
      const entriesByTtl: Record<string, [string, any][]> = {};

      for (const [key, value, ttl] of entries) {
        const ttlKey = ttl?.toString() || 'none';
        if (!entriesByTtl[ttlKey]) {
          entriesByTtl[ttlKey] = [];
        }
        entriesByTtl[ttlKey].push([key, value]);
      }

      // Process each TTL group
      for (const [ttlKey, keyValues] of Object.entries(entriesByTtl)) {
        if (ttlKey === 'none') {
          // No TTL, use regular mset
          const flatKeyValues = keyValues.flat();
          await this.redis!.mset(...flatKeyValues);
        } else {
          // With TTL, use pipeline with individual setex commands
          const ttl = parseInt(ttlKey, 10);
          const pipeline = this.redis!.pipeline();

          for (const [key, value] of keyValues) {
            pipeline.setex(key, ttl, value);
          }

          await pipeline.exec();
        }
      }
    } catch (error) {
      console.error(`Redis cache mset error:`, error);
    }
  }

  /**
   * Increment a counter in the cache
   * @param key Cache key
   * @param increment Amount to increment (default: 1)
   * @returns New value
   */
  public async incr(key: string, increment = 1): Promise<number> {
    if (!this.isEnabled()) return 0;

    try {
      if (increment === 1) {
        return await this.redis!.incr(key);
      } else {
        return await this.redis!.incrby(key, increment);
      }
    } catch (error) {
      console.error(`Redis cache incr error for key ${key}:`, error);
      return 0;
    }
  }
}

// Export a singleton instance
export const redisCache = RedisCache.getInstance();
