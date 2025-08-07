import { createClient } from '@vercel/edge-config';

// Create Edge Config client only if connection string is available
const edgeConfig = process.env.EDGE_CONFIG
  ? createClient(process.env.EDGE_CONFIG)
  : null;

// Feature flags interface
export interface FeatureFlags {
  waitlistEnabled: boolean;
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
}

// Default feature flags (fallback)
const defaultFeatureFlags: FeatureFlags = {
  waitlistEnabled: false,
  artistSearchEnabled: true,
  debugBannerEnabled: process.env.NODE_ENV === 'development',
  tipPromoEnabled: true,
};

// Get feature flags from Edge Config
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    if (!edgeConfig) {
      console.warn('Edge Config not available, using default feature flags');
      return defaultFeatureFlags;
    }

    const flags = await edgeConfig.get<FeatureFlags>('featureFlags');

    if (!flags) {
      console.warn('No feature flags found in Edge Config, using defaults');
      return defaultFeatureFlags;
    }

    return {
      ...defaultFeatureFlags,
      ...flags,
    };
  } catch (error) {
    console.error('Error fetching feature flags from Edge Config:', error);
    return defaultFeatureFlags;
  }
}

// Client-side hook for feature flags (for components that need real-time updates)
export function useFeatureFlags(): FeatureFlags {
  // For now, return default flags on client side
  // In the future, we could implement real-time updates via Edge Config
  return defaultFeatureFlags;
}

// Server-side function to get feature flags
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  return getFeatureFlags();
}
