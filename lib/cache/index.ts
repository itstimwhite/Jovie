/**
 * Cache layer exports and utilities
 */

export { ProfileCache, GenericCache, profileCache, apiCache, queryCache } from './redis';
export { CacheInvalidation, cacheInvalidation } from './invalidation';
export { cacheMonitoring } from './monitoring';

// Cache configuration constants
export const CACHE_TTL = {
  PROFILE: 3600, // 1 hour
  POPULAR_PROFILES: 1800, // 30 minutes
  API_ROUTES: 300, // 5 minutes
  STATIC_CONTENT: 86400, // 24 hours
  EDGE_CACHE: 300, // 5 minutes
} as const;

export const CACHE_KEYS = {
  PROFILE: (username: string) => `profile:${username.toLowerCase()}`,
  SOCIAL_LINKS: (username: string) => `social-links:${username.toLowerCase()}`,
  POPULAR_PROFILES: 'popular-profiles',
  FEATURED_ARTISTS: 'featured-artists',
  API_RESPONSE: (endpoint: string) => `api:${endpoint}`,
} as const;