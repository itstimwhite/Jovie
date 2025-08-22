/**
 * Server-side feature flag helpers
 * Provides utilities for fetching and using feature flags in server components
 */

import { headers } from 'next/headers';
import { FeatureFlags } from '@/lib/feature-flags';
import { getServerFeatureFlagsConfig } from './feature-flags-config';

/**
 * Get feature flags for server-side rendering
 * This is the primary method for server components to access feature flags
 *
 * @returns Promise<FeatureFlags> The feature flags for the current environment
 */
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  try {
    // Get headers for host information
    let host: string | null = null;
    let proto: string = 'https';
    
    try {
      const h = headers();
      host = h.get('x-forwarded-host') || h.get('host');
      proto = h.get('x-forwarded-proto') || 
        (host && host.includes('localhost') ? 'http' : 'https');
    } catch (headerError) {
      console.warn('Error accessing headers:', headerError);
      // Continue with default config if headers are not accessible
      return getServerFeatureFlagsConfig();
    }

    if (!host) {
      // Fallback to environment config if headers are not available
      return getServerFeatureFlagsConfig();
    }

    // Fetch from internal API with proper caching
    const url = `${proto}://${host}/api/feature-flags`;
    const res = await fetch(url, {
      cache: 'force-cache',
      next: { revalidate: SERVER_FLAGS_CACHE_TTL },
    });

    if (res.ok) {
      const data = await res.json();
      return data as FeatureFlags;
    }
  } catch (error) {
    console.error('Error fetching server feature flags:', error);
  }

  // Fallback to environment config if API fetch fails
  return getServerFeatureFlagsConfig();
}

// Cache TTL in seconds for server-side feature flags
const SERVER_FLAGS_CACHE_TTL = 60; // 1 minute

/**
 * Get a specific feature flag for server-side rendering
 * Convenience method for accessing a single flag
 *
 * @param flagName The name of the flag to get
 * @returns Promise<boolean> The value of the flag
 */
export async function getServerFeatureFlag(
  flagName: keyof FeatureFlags
): Promise<boolean> {
  const flags = await getServerFeatureFlags();
  return flags[flagName];
}

