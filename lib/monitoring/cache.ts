import { cache } from '@/lib/cache';

/**
 * Cache monitoring utility for tracking cache performance
 */
export class CacheMonitoring {
  /**
   * Track a cache hit
   * @param layer Cache layer (edge, app, redis)
   * @param key Cache key
   */
  public static async trackCacheHit(
    layer: 'edge' | 'app' | 'redis',
    key: string
  ): Promise<void> {
    try {
      // Increment the hit counter for this specific key
      await cache.monitoring.trackHit(layer, key);

      // Increment the total hit counter for this layer
      await cache.monitoring.trackHit(layer, 'total');

      // If analytics is available, track the event
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Cache Hit', {
          layer,
          key: hashKey(key),
          timestamp: Date.now(),
        } as Record<string, string | number>);
      }
    } catch (error) {
      // Ignore errors in monitoring
      console.error('Error tracking cache hit:', error);
    }
  }

  /**
   * Track a cache miss
   * @param layer Cache layer (edge, app, redis)
   * @param key Cache key
   */
  public static async trackCacheMiss(
    layer: 'edge' | 'app' | 'redis',
    key: string
  ): Promise<void> {
    try {
      // Increment the miss counter for this specific key
      await cache.monitoring.trackMiss(layer, key);

      // Increment the total miss counter for this layer
      await cache.monitoring.trackMiss(layer, 'total');

      // If analytics is available, track the event
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Cache Miss', {
          layer,
          key: hashKey(key),
          timestamp: Date.now(),
        } as Record<string, string | number>);
      }
    } catch (error) {
      // Ignore errors in monitoring
      console.error('Error tracking cache miss:', error);
    }
  }

  /**
   * Get cache hit rate for a specific layer
   * @param layer Cache layer (edge, app, redis)
   * @returns Hit rate percentage or null if no data
   */
  public static async getCacheHitRate(
    layer: 'edge' | 'app' | 'redis'
  ): Promise<number | null> {
    return await cache.monitoring.getHitRate(layer);
  }

  /**
   * Get cache hit rates for all layers
   * @returns Object with hit rates for each layer
   */
  public static async getAllCacheHitRates(): Promise<
    Record<string, number | null>
  > {
    const [edge, app, redis] = await Promise.all([
      CacheMonitoring.getCacheHitRate('edge'),
      CacheMonitoring.getCacheHitRate('app'),
      CacheMonitoring.getCacheHitRate('redis'),
    ]);

    return {
      edge,
      app,
      redis,
    };
  }

  /**
   * Clear all monitoring data
   */
  public static async clearMonitoringData(): Promise<void> {
    try {
      await cache.redisCache.delByPattern('stats:*');
    } catch (error) {
      console.error('Error clearing monitoring data:', error);
    }
  }
}

/**
 * Simple hash function for cache keys
 * Used to avoid sending full cache keys to analytics
 * @param key Cache key to hash
 * @returns Hashed key
 */
function hashKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Add analytics type for TypeScript
declare global {
  interface Window {
    analytics?: {
      track: (
        event: string,
        properties?: Record<string, string | number>
      ) => void;
    };
  }
}
