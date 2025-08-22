// =====================================
// FEATURE FLAGS TYPES
// =====================================
// This file exports types related to feature flags for use across the app
// Usage: import { FeatureFlags, FeatureFlagName } from '@/types';

/**
 * Core feature flags interface
 * All feature flags should be defined here for type safety
 */
export interface FeatureFlags {
  /** Controls artist search functionality */
  artistSearchEnabled: boolean;
  
  /** Controls debug banner visibility */
  debugBannerEnabled: boolean;
  
  /** Controls tip promotion features */
  tipPromoEnabled: boolean;
  
  /** Use Clerk for pricing */
  pricingUseClerk: boolean;
  
  /** Enable universal notifications */
  universalNotificationsEnabled: boolean;
  
  /** Use RPC for click analytics */
  featureClickAnalyticsRpc: boolean;
}

/**
 * Type for feature flag names
 * Used for type-safe access to feature flags
 */
export type FeatureFlagName = keyof FeatureFlags;

/**
 * Statsig feature flag types
 * Represents the structure of feature flags in Statsig
 */
export interface StatsigFeatureFlags {
  /** Controls waitlist functionality */
  waitlist_enabled: boolean;
  
  /** Controls debug banner visibility */
  debug_banner_enabled: boolean;
  
  /** Artist search configuration */
  artist_search_config: {
    enabled: boolean;
    [key: string]: unknown;
  };
  
  /** Tip promotion configuration */
  tip_promo_config: {
    enabled: boolean;
    [key: string]: unknown;
  };
}

/**
 * PostHog feature flag constants
 * Used for type-safe access to PostHog feature flags
 */
export const POSTHOG_FEATURE_FLAGS = {
  /** Enable handle claiming feature */
  CLAIM_HANDLE: 'feature_claim_handle',
} as const;

/**
 * Type for PostHog feature flag names
 */
export type PosthogFeatureFlagName = 
  (typeof POSTHOG_FEATURE_FLAGS)[keyof typeof POSTHOG_FEATURE_FLAGS];

/**
 * Feature flag source enum
 * Identifies where a feature flag is defined
 */
export enum FeatureFlagSource {
  SERVER = 'server',
  STATSIG = 'statsig',
  POSTHOG = 'posthog'
}

/**
 * Feature flag metadata
 * Used for documentation and tooling
 */
export interface FeatureFlagMetadata {
  name: string;
  description: string;
  source: FeatureFlagSource;
  defaultValue: boolean | Record<string, unknown>;
  privacySensitive: boolean;
}

