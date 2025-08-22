import { redisCache } from './redis';
import { cache } from './index';

/**
 * Cache invalidation utility for managing cache across multiple layers
 */
export class CacheInvalidation {
  /**
   * Invalidate a profile and all related caches
   * @param username Username of the profile to invalidate
   */
  public async invalidateProfile(username: string): Promise<void> {
    try {
      // Step 1: Get the profile from cache to get the ID
      const profile = await cache.profile.get(username);

      // Step 2: Delete the profile from Redis cache
      await cache.profile.delete(username);

      // Step 3: If we have the profile ID, also invalidate social links
      if (profile?.id) {
        await cache.socialLinks.delete(profile.id);
      }

      // Step 4: Trigger Next.js on-demand revalidation for the profile page
      await this.revalidatePath(`/${username}`);

      // Step 5: Purge CDN cache for the profile page
      await this.cdnPurge(`/${username}`);

      console.log(`Successfully invalidated cache for profile: ${username}`);
    } catch (error) {
      console.error(`Error invalidating profile cache for ${username}:`, error);
    }
  }

  /**
   * Invalidate social links for a profile
   * @param profileId Profile ID
   */
  public async invalidateSocialLinks(profileId: string): Promise<void> {
    try {
      // Step 1: Delete social links from Redis cache
      await cache.socialLinks.delete(profileId);

      // Step 2: Try to find the username for this profile ID to invalidate the profile page
      // This is a simplified approach - in a real implementation, you might want to
      // maintain a reverse mapping or query the database
      const keys = await redisCache.redis?.keys('profile:*');
      if (keys && keys.length > 0) {
        const profiles = await redisCache.mget(keys);

        for (const [key, profile] of Object.entries(profiles)) {
          if (profile && profile.id === profileId) {
            // Extract username from the key (profile:username)
            const username = key.split(':')[1];

            // Revalidate the profile page
            await this.revalidatePath(`/${username}`);

            // Purge CDN cache
            await this.cdnPurge(`/${username}`);

            break;
          }
        }
      }

      console.log(
        `Successfully invalidated social links cache for profile ID: ${profileId}`
      );
    } catch (error) {
      console.error(
        `Error invalidating social links cache for ${profileId}:`,
        error
      );
    }
  }

  /**
   * Invalidate API cache for a specific path
   * @param path API path to invalidate
   */
  public async invalidateApiCache(path: string): Promise<void> {
    try {
      await cache.api.deleteByPath(path);
      console.log(`Successfully invalidated API cache for path: ${path}`);
    } catch (error) {
      console.error(`Error invalidating API cache for ${path}:`, error);
    }
  }

  /**
   * Invalidate popular profiles cache
   */
  public async invalidatePopularProfiles(): Promise<void> {
    try {
      await cache.popularProfiles.set([], 0); // Set empty array with 0 TTL to effectively delete
      console.log('Successfully invalidated popular profiles cache');
    } catch (error) {
      console.error('Error invalidating popular profiles cache:', error);
    }
  }

  /**
   * Trigger Next.js on-demand revalidation for a path
   * @param path Path to revalidate
   */
  private async revalidatePath(path: string): Promise<void> {
    try {
      // Call the revalidation API endpoint
      const revalidateUrl = `/api/revalidate?path=${encodeURIComponent(path)}`;

      // Use fetch with no-cache to ensure we don't get a cached response
      const response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add a secret token for security if needed
          ...(process.env.REVALIDATE_TOKEN && {
            Authorization: `Bearer ${process.env.REVALIDATE_TOKEN}`,
          }),
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          `Revalidation failed: ${response.status} ${response.statusText}`
        );
      }

      console.log(`Successfully revalidated path: ${path}`);
    } catch (error) {
      console.error(`Error revalidating path ${path}:`, error);
    }
  }

  /**
   * Purge CDN cache for a path
   * @param path Path to purge from CDN
   */
  private async cdnPurge(path: string): Promise<void> {
    try {
      // For Vercel, we can use their Purge API
      // This is a simplified example - in production, you'd use the actual Vercel API
      if (process.env.VERCEL_PURGE_TOKEN) {
        const vercelPurgeUrl = `https://api.vercel.com/v1/projects/${process.env.VERCEL_PROJECT_ID}/domains/${process.env.VERCEL_DOMAIN}/purge-cache`;

        const response = await fetch(vercelPurgeUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_PURGE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [path],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `CDN purge failed: ${response.status} ${response.statusText}`
          );
        }

        console.log(`Successfully purged CDN cache for path: ${path}`);
      } else {
        // If not on Vercel or no token available, log but don't fail
        console.log(`CDN purge not available for path: ${path}`);
      }
    } catch (error) {
      console.error(`Error purging CDN cache for ${path}:`, error);
    }
  }
}

// Export a singleton instance
export const cacheInvalidation = new CacheInvalidation();
