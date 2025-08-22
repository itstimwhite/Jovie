import { redisCache, CACHE_TTL } from './redis';
import { CreatorProfile, LegacySocialLink } from '@/types/db';

/**
 * Cache key generators for different entity types
 */
export const cacheKeys = {
  profile: (username: string) => `profile:${username.toLowerCase()}`,
  socialLinks: (profileId: string) => `social_links:${profileId}`,
  popularProfiles: () => 'popular_profiles',
  apiResponse: (path: string, params: Record<string, string>) => {
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `api:${path}${sortedParams ? `?${sortedParams}` : ''}`;
  },
};

/**
 * Profile cache operations
 */
export const profileCache = {
  /**
   * Get a profile from cache
   * @param username Username to look up
   * @returns Cached profile or null
   */
  async get(username: string): Promise<CreatorProfile | null> {
    return await redisCache.get<CreatorProfile>(cacheKeys.profile(username));
  },

  /**
   * Set a profile in cache
   * @param username Username as cache key
   * @param profile Profile data to cache
   * @param ttl Optional custom TTL in seconds
   */
  async set(
    username: string,
    profile: CreatorProfile,
    ttl = CACHE_TTL.PROFILE
  ): Promise<void> {
    await redisCache.set(cacheKeys.profile(username), profile, ttl);
  },

  /**
   * Delete a profile from cache
   * @param username Username to delete
   */
  async delete(username: string): Promise<void> {
    await redisCache.del(cacheKeys.profile(username));
  },

  /**
   * Get multiple profiles from cache
   * @param usernames Array of usernames to look up
   * @returns Object with username-profile pairs
   */
  async getMany(
    usernames: string[]
  ): Promise<Record<string, CreatorProfile | null>> {
    const keys = usernames.map((username) => cacheKeys.profile(username));
    const result = await redisCache.mget<CreatorProfile>(keys);

    // Convert back to username-based keys
    return Object.entries(result).reduce(
      (acc, [key, value]) => {
        // Extract username from cache key (profile:username)
        const username = key.split(':')[1];
        acc[username] = value;
        return acc;
      },
      {} as Record<string, CreatorProfile | null>
    );
  },

  /**
   * Set multiple profiles in cache
   * @param profiles Array of [username, profile] tuples
   * @param ttl Optional custom TTL in seconds
   */
  async setMany(
    profiles: [string, CreatorProfile][],
    ttl = CACHE_TTL.PROFILE
  ): Promise<void> {
    const entries = profiles.map(([username, profile]) => [
      cacheKeys.profile(username),
      profile,
      ttl,
    ]);
    await redisCache.mset(entries);
  },
};

/**
 * Social links cache operations
 */
export const socialLinksCache = {
  /**
   * Get social links from cache
   * @param profileId Profile ID to look up
   * @returns Cached social links or null
   */
  async get(profileId: string): Promise<LegacySocialLink[] | null> {
    return await redisCache.get<LegacySocialLink[]>(
      cacheKeys.socialLinks(profileId)
    );
  },

  /**
   * Set social links in cache
   * @param profileId Profile ID as cache key
   * @param links Social links data to cache
   * @param ttl Optional custom TTL in seconds
   */
  async set(
    profileId: string,
    links: LegacySocialLink[],
    ttl = CACHE_TTL.SOCIAL_LINKS
  ): Promise<void> {
    await redisCache.set(cacheKeys.socialLinks(profileId), links, ttl);
  },

  /**
   * Delete social links from cache
   * @param profileId Profile ID to delete
   */
  async delete(profileId: string): Promise<void> {
    await redisCache.del(cacheKeys.socialLinks(profileId));
  },
};

/**
 * Popular profiles cache operations
 */
export const popularProfilesCache = {
  /**
   * Get popular profiles from cache
   * @returns Cached popular profiles or null
   */
  async get(): Promise<string[] | null> {
    return await redisCache.get<string[]>(cacheKeys.popularProfiles());
  },

  /**
   * Set popular profiles in cache
   * @param usernames Array of popular profile usernames
   * @param ttl Optional custom TTL in seconds
   */
  async set(
    usernames: string[],
    ttl = CACHE_TTL.POPULAR_PROFILES
  ): Promise<void> {
    await redisCache.set(cacheKeys.popularProfiles(), usernames, ttl);
  },
};

/**
 * API response cache operations
 */
export const apiCache = {
  /**
   * Get an API response from cache
   * @param path API path
   * @param params Query parameters
   * @returns Cached API response or null
   */
  async get<T>(
    path: string,
    params: Record<string, string> = {}
  ): Promise<T | null> {
    return await redisCache.get<T>(cacheKeys.apiResponse(path, params));
  },

  /**
   * Set an API response in cache
   * @param path API path
   * @param params Query parameters
   * @param data Response data to cache
   * @param ttl Optional custom TTL in seconds
   */
  async set<T>(
    path: string,
    params: Record<string, string> = {},
    data: T,
    ttl = CACHE_TTL.API_RESPONSE
  ): Promise<void> {
    await redisCache.set(cacheKeys.apiResponse(path, params), data, ttl);
  },

  /**
   * Delete an API response from cache
   * @param path API path
   * @param params Query parameters
   */
  async delete(
    path: string,
    params: Record<string, string> = {}
  ): Promise<void> {
    await redisCache.del(cacheKeys.apiResponse(path, params));
  },

  /**
   * Delete all API responses for a specific path
   * @param path API path
   */
  async deleteByPath(path: string): Promise<void> {
    await redisCache.delByPattern(`api:${path}*`);
  },
};

/**
 * Cache monitoring operations
 */
export const cacheMonitoring = {
  /**
   * Track a cache hit
   * @param layer Cache layer (edge, app, redis)
   * @param key Cache key
   */
  async trackHit(layer: 'edge' | 'app' | 'redis', key: string): Promise<void> {
    await redisCache.incr(`stats:hit:${layer}:${key}`);
  },

  /**
   * Track a cache miss
   * @param layer Cache layer (edge, app, redis)
   * @param key Cache key
   */
  async trackMiss(layer: 'edge' | 'app' | 'redis', key: string): Promise<void> {
    await redisCache.incr(`stats:miss:${layer}:${key}`);
  },

  /**
   * Get cache hit rate for a specific layer
   * @param layer Cache layer (edge, app, redis)
   * @returns Hit rate percentage or null if no data
   */
  async getHitRate(layer: 'edge' | 'app' | 'redis'): Promise<number | null> {
    const hits =
      (await redisCache.get<number>(`stats:hit:${layer}:total`)) || 0;
    const misses =
      (await redisCache.get<number>(`stats:miss:${layer}:total`)) || 0;
    const total = hits + misses;

    if (total === 0) return null;
    return (hits / total) * 100;
  },
};

// Export the cache interface
export const cache = {
  profile: profileCache,
  socialLinks: socialLinksCache,
  popularProfiles: popularProfilesCache,
  api: apiCache,
  monitoring: cacheMonitoring,
  isEnabled: redisCache.isEnabled.bind(redisCache),
};
