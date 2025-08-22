/**
 * Cache invalidation utilities
 * Handles coordinated cache invalidation across multiple layers
 */

import { profileCache, apiCache } from './redis';

export class CacheInvalidation {
  /**
   * Invalidate all caches for a specific profile
   */
  async invalidateProfile(username: string): Promise<void> {
    const cleanUsername = username.toLowerCase();
    
    try {
      // Run invalidations in parallel
      await Promise.all([
        // Redis cache
        profileCache.invalidateProfile(cleanUsername),
        
        // API cache entries
        apiCache.del(`profile:${cleanUsername}`),
        apiCache.del(`social-links:${cleanUsername}`),
        
        // Next.js cache revalidation via API
        this.revalidateNextJsCache(cleanUsername),
        
        // CDN purge (if configured)
        this.cdnPurge(cleanUsername)
      ]);

      console.log(`Cache invalidated for profile: ${cleanUsername}`);
    } catch (error) {
      console.error('Cache invalidation error:', error);
      // Don't throw - invalidation failures shouldn't break the app
    }
  }

  /**
   * Invalidate API route caches
   */
  async invalidateApiRoutes(routes: string[]): Promise<void> {
    try {
      await Promise.all(
        routes.map(route => apiCache.del(route))
      );
    } catch (error) {
      console.error('API cache invalidation error:', error);
    }
  }

  /**
   * Trigger Next.js cache revalidation
   */
  private async revalidateNextJsCache(username: string): Promise<void> {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

      // Revalidate profile page
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REVALIDATE_SECRET || 'dev-secret'}`,
        },
        body: JSON.stringify({
          tags: [`profile-${username}`],
          paths: [`/${username}`]
        }),
      });

      if (!response.ok) {
        console.warn('Next.js revalidation failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Next.js revalidation error:', error);
    }
  }

  /**
   * Purge CDN cache (placeholder for future CDN integration)
   */
  private async cdnPurge(username: string): Promise<void> {
    // Placeholder for CDN purging
    // This would integrate with your CDN provider (Cloudflare, AWS CloudFront, etc.)
    
    if (process.env.CDN_PURGE_ENDPOINT && process.env.CDN_API_KEY) {
      try {
        const urls = [
          `/${username}`,
          `/${username}/listen`,
          `/${username}/tip`,
          `/api/profiles/${username}`
        ];

        // Example CDN purge implementation
        await fetch(process.env.CDN_PURGE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CDN_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls }),
        });
      } catch (error) {
        console.warn('CDN purge error:', error);
      }
    }
  }

  /**
   * Bulk invalidation for multiple profiles
   */
  async invalidateProfiles(usernames: string[]): Promise<void> {
    await Promise.all(
      usernames.map(username => this.invalidateProfile(username))
    );
  }

  /**
   * Invalidate popular profiles cache
   */
  async invalidatePopularProfiles(): Promise<void> {
    try {
      await apiCache.del('popular-profiles');
      await apiCache.del('featured-artists');
    } catch (error) {
      console.error('Popular profiles cache invalidation error:', error);
    }
  }

  /**
   * Scheduled cache warming for popular profiles
   */
  async warmPopularProfiles(): Promise<void> {
    // This could be called by a cron job or webhook
    // Implementation would fetch and cache popular profiles
    console.log('Cache warming would be implemented here');
  }
}

// Singleton instance
export const cacheInvalidation = new CacheInvalidation();