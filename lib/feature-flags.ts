import { useFeatureGate, useDynamicConfig } from '@statsig/react-bindings';

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

// Hook for using feature flags with Statsig
export function useFeatureFlags(): FeatureFlags {
  // Use Statsig gates and configs
  const waitlistGate = useFeatureGate('waitlist_enabled');
  const debugBannerGate = useFeatureGate('debug_banner_enabled');
  const artistSearchConfig = useDynamicConfig('artist_search_config');
  const tipPromoConfig = useDynamicConfig('tip_promo_config');

  return {
    waitlistEnabled: waitlistGate.value,
    debugBannerEnabled: debugBannerGate.value,
    artistSearchEnabled: artistSearchConfig.get('enabled', true),
    tipPromoEnabled: tipPromoConfig.get('enabled', true),
  };
}

// Server-side function to get feature flags (for SSR)
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  // For server-side, we'll use the default flags
  // In a production setup, you might want to use Statsig's server SDK
  return defaultFeatureFlags;
}

// Legacy function for backward compatibility
export async function getFeatureFlags(): Promise<FeatureFlags> {
  return getServerFeatureFlags();
}
