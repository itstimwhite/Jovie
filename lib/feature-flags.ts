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
  debugBannerEnabled: false, // Disabled by default
  tipPromoEnabled: true,
};

// Get feature flags (simplified for now)
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // For now, return default flags
  // In the future, we can integrate with Statsig or other feature flag services
  return defaultFeatureFlags;
}

// Server-side function to get feature flags
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  return getFeatureFlags();
}
