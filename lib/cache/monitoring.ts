/**
 * Cache monitoring and analytics
 * Tracks cache performance and provides insights
 */

import { profileCache } from './redis';

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  layer: 'edge' | 'app' | 'redis';
  timestamp: number;
}

export class CacheMonitoring {
  /**
   * Track cache hit for analytics
   */
  trackCacheHit(layer: 'edge' | 'app' | 'redis', key: string): void {
    try {
      // Track in Redis for persistence
      profileCache.trackHit();

      // Track in analytics (PostHog, etc.)
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('Cache Hit', {
          layer,
          keyHash: this.hashKey(key),
          timestamp: Date.now(),
        });
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache Hit] ${layer}: ${this.sanitizeKey(key)}`);
      }
    } catch (error) {
      console.warn('Cache hit tracking error:', error);
    }
  }

  /**
   * Track cache miss for analytics
   */
  trackCacheMiss(layer: 'edge' | 'app' | 'redis', key: string): void {
    try {
      // Track in Redis for persistence
      profileCache.trackMiss();

      // Track in analytics
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('Cache Miss', {
          layer,
          keyHash: this.hashKey(key),
          timestamp: Date.now(),
        });
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache Miss] ${layer}: ${this.sanitizeKey(key)}`);
      }
    } catch (error) {
      console.warn('Cache miss tracking error:', error);
    }
  }

  /**
   * Get comprehensive cache metrics
   */
  async getCacheMetrics(): Promise<CacheMetrics[]> {
    try {
      const redisStats = await profileCache.getStats();
      
      return [
        {
          ...redisStats,
          layer: 'redis',
          timestamp: Date.now(),
        }
      ];
    } catch (error) {
      console.error('Cache metrics error:', error);
      return [];
    }
  }

  /**
   * Log cache performance summary
   */
  async logCachePerformance(): Promise<void> {
    try {
      const metrics = await this.getCacheMetrics();
      
      metrics.forEach(metric => {
        console.log(`[Cache Performance] ${metric.layer.toUpperCase()}: ${(metric.hitRate * 100).toFixed(1)}% hit rate (${metric.hits} hits, ${metric.misses} misses)`);
      });
    } catch (error) {
      console.error('Cache performance logging error:', error);
    }
  }

  /**
   * Check if cache hit rate meets performance targets
   */
  async checkPerformanceTargets(): Promise<boolean> {
    try {
      const metrics = await this.getCacheMetrics();
      const TARGET_HIT_RATE = 0.85; // 85% target hit rate
      
      return metrics.every(metric => metric.hitRate >= TARGET_HIT_RATE);
    } catch (error) {
      console.error('Cache performance check error:', error);
      return false;
    }
  }

  /**
   * Hash sensitive keys for analytics
   */
  private hashKey(key: string): string {
    // Simple hash to anonymize keys while maintaining uniqueness
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Sanitize keys for logging (remove sensitive data)
   */
  private sanitizeKey(key: string): string {
    // Remove potential PII while keeping structure
    return key.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
              .replace(/\b\d{4,}\b/g, '[number]');
  }

  /**
   * Performance alert if hit rate drops
   */
  async alertOnPoorPerformance(): Promise<void> {
    const isPerformant = await this.checkPerformanceTargets();
    
    if (!isPerformant) {
      console.warn('[Cache Alert] Cache hit rate below target threshold');
      
      // In production, this could send alerts to monitoring services
      if (process.env.NODE_ENV === 'production') {
        // Send to monitoring service (Sentry, DataDog, etc.)
        console.error('Cache performance degraded - investigate cache configuration');
      }
    }
  }
}

// Singleton instance
export const cacheMonitoring = new CacheMonitoring();