/**
 * Feature flags for the application
 * This module defines the feature flags and their default values
 */

export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
  pricingUseClerk: boolean;
  universalNotificationsEnabled: boolean;
  featureClickAnalyticsRpc: boolean;
  progressiveOnboardingEnabled: boolean;
  feature_expired_auth_flow: boolean; // New flag for expired auth flow
}

// Default feature flags
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: false,
  tipPromoEnabled: true,
  pricingUseClerk: false,
  universalNotificationsEnabled: false,
  featureClickAnalyticsRpc: false,
  progressiveOnboardingEnabled: true,
  feature_expired_auth_flow: false, // Disabled by default
};

/**
 * Get feature flags for server-side rendering
 * This is used in Server Components
 */
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  // In the future, this could fetch from a feature flag service
  return DEFAULT_FEATURE_FLAGS;
}

/**
 * Get feature flags for client-side rendering
 * This is used in Client Components
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    // In the future, this could fetch from an API endpoint
    return DEFAULT_FEATURE_FLAGS;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return DEFAULT_FEATURE_FLAGS;
  }
}

