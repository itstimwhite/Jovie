/**
 * Redis caching utilities for Jovie
 * Provides multi-level caching for profile data and other frequently accessed content
 */

import { Redis } from '@upstash/redis';
import { CreatorProfile } from '@/types/db';

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  namespace?: string;
}

export class ProfileCache {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour default

  constructor() {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Missing Upstash Redis configuration. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
    }

    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  /**
   * Generate a cache key with optional namespace
   */
  private key(type: string, id: string, namespace?: string): string {
    const prefix = namespace ? `${namespace}:` : '';
    return `${prefix}${type}:${id}`;
  }

  /**
   * Get profile from cache or return null if not found
   */
  async getProfile(username: string): Promise<CreatorProfile | null> {
    try {
      const cached = await this.redis.get(this.key('profile', username.toLowerCase()));
      if (cached && typeof cached === 'object') {
        return cached as CreatorProfile;
      }
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null; // Fail gracefully
    }
  }

  /**
   * Cache a profile with default or custom TTL
   */
  async setProfile(username: string, profile: CreatorProfile, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redis.setex(
        this.key('profile', username.toLowerCase()),
        ttl,
        profile
      );
    } catch (error) {
      console.error('Redis set error:', error);
      // Don't throw - cache failures shouldn't break the app
    }
  }

  /**
   * Invalidate a profile cache entry
   */
  async invalidateProfile(username: string): Promise<void> {
    try {
      await this.redis.del(this.key('profile', username.toLowerCase()));
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  /**
   * Cache popular profiles for warming
   */
  async warmPopularProfiles(profiles: { username: string; profile: CreatorProfile }[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    
    profiles.forEach(({ username, profile }) => {
      pipeline.setex(
        this.key('profile', username.toLowerCase()),
        this.defaultTTL,
        profile
      );
    });

    try {
      await pipeline.exec();
    } catch (error) {
      console.error('Redis pipeline error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ hits: number; misses: number; hitRate: number }> {
    try {
      const hits = await this.redis.get('cache:stats:hits') || 0;
      const misses = await this.redis.get('cache:stats:misses') || 0;
      const total = Number(hits) + Number(misses);
      const hitRate = total > 0 ? Number(hits) / total : 0;

      return {
        hits: Number(hits),
        misses: Number(misses),
        hitRate: Math.round(hitRate * 100) / 100
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return { hits: 0, misses: 0, hitRate: 0 };
    }
  }

  /**
   * Track cache hit
   */
  async trackHit(): Promise<void> {
    try {
      await this.redis.incr('cache:stats:hits');
    } catch (error) {
      console.error('Redis track hit error:', error);
    }
  }

  /**
   * Track cache miss
   */
  async trackMiss(): Promise<void> {
    try {
      await this.redis.incr('cache:stats:misses');
    } catch (error) {
      console.error('Redis track miss error:', error);
    }
  }
}

/**
 * Generic cache for other types of data
 */
export class GenericCache {
  private redis: Redis;
  private namespace: string;

  constructor(namespace: string = 'generic') {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Missing Upstash Redis configuration');
    }

    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    this.namespace = namespace;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(`${this.namespace}:${key}`);
      return cached as T | null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(`${this.namespace}:${key}`, ttl, value);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(`${this.namespace}:${key}`);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
}

// Singleton instances
export const profileCache = new ProfileCache();
export const apiCache = new GenericCache('api');
export const queryCache = new GenericCache('query');