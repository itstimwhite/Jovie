/**
 * Server-side feature flag configuration
 * Provides environment-aware feature flag configuration for server-side rendering
 */

import { FeatureFlags } from '@/lib/feature-flags';

// Environment variables for feature flags
// Format: FEATURE_FLAG_<FLAG_NAME> (uppercase snake case)
const getBooleanEnv = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Get server-side feature flags configuration
 * This is the source of truth for SSR-critical feature flags
 */
export function getServerFeatureFlagsConfig(): FeatureFlags {
  return {
    // SSR-critical flags - these should be controlled via environment variables
    // with sensible defaults for each environment
    artistSearchEnabled: getBooleanEnv(
      'FEATURE_FLAG_ARTIST_SEARCH_ENABLED',
      true
    ),
    debugBannerEnabled: getBooleanEnv(
      'FEATURE_FLAG_DEBUG_BANNER_ENABLED',
      process.env.NODE_ENV === 'development'
    ),
    tipPromoEnabled: getBooleanEnv('FEATURE_FLAG_TIP_PROMO_ENABLED', true),
    pricingUseClerk: getBooleanEnv('FEATURE_FLAG_PRICING_USE_CLERK', false),
    universalNotificationsEnabled: getBooleanEnv(
      'FEATURE_FLAG_UNIVERSAL_NOTIFICATIONS_ENABLED',
      process.env.NODE_ENV === 'development'
    ),
    featureClickAnalyticsRpc: getBooleanEnv(
      'FEATURE_FLAG_CLICK_ANALYTICS_RPC',
      false
    ),
  };
}

/**
 * Categorize feature flags as SSR-critical or experimental
 * This helps developers understand which flags should be used for which purposes
 */
export const SSR_CRITICAL_FLAGS = [
  'pricingUseClerk', // Controls pricing table provider
  'universalNotificationsEnabled', // Controls notification UI
  'featureClickAnalyticsRpc', // Controls analytics behavior
] as const;

export const EXPERIMENTAL_FLAGS = [
  'artistSearchEnabled', // Non-critical UI feature
  'debugBannerEnabled', // Development-only feature
  'tipPromoEnabled', // Non-critical promotional UI
] as const;

export type SsrCriticalFlagName = (typeof SSR_CRITICAL_FLAGS)[number];
export type ExperimentalFlagName = (typeof EXPERIMENTAL_FLAGS)[number];

/**
 * Check if a flag is SSR-critical
 * @param flagName The name of the flag to check
 * @returns True if the flag is SSR-critical, false otherwise
 */
export function isSsrCriticalFlag(
  flagName: string
): flagName is SsrCriticalFlagName {
  return (SSR_CRITICAL_FLAGS as readonly string[]).includes(flagName);
}

/**
 * Check if a flag is experimental
 * @param flagName The name of the flag to check
 * @returns True if the flag is experimental, false otherwise
 */
export function isExperimentalFlag(
  flagName: string
): flagName is ExperimentalFlagName {
  return (EXPERIMENTAL_FLAGS as readonly string[]).includes(flagName);
}
