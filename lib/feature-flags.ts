import {
  debugBannerEnabled,
  artistSearchEnabled,
  tipPromoEnabled,
} from './flags';

// Feature flags interface
export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
}

// Default feature flags (fallback)
const defaultFeatureFlags: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: true, // Show on all environments by default
  tipPromoEnabled: true,
};

// Get feature flags (v4-compatible: uses the flags SDK response format)
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // On the server, delegate to the robust server-side variant
  if (typeof window === 'undefined') {
    return getServerFeatureFlags();
  }
  // On the client, fetch from the discovery endpoint for consistency
  try {
    const res = await fetch('/.well-known/vercel/flags');
    if (res.ok) {
      const data = (await res.json()) as {
        version?: number;
        definitions?: Record<string, { defaultValue?: unknown }>;
      };
      if (typeof data?.version === 'number' && data.definitions) {
        return {
          artistSearchEnabled: Boolean(
            data.definitions.artistSearchEnabled?.defaultValue ??
              defaultFeatureFlags.artistSearchEnabled
          ),
          debugBannerEnabled: Boolean(
            data.definitions.debugBannerEnabled?.defaultValue ??
              defaultFeatureFlags.debugBannerEnabled
          ),
          tipPromoEnabled: Boolean(
            data.definitions.tipPromoEnabled?.defaultValue ??
              defaultFeatureFlags.tipPromoEnabled
          ),
        };
      }
    }
  } catch {
    // Ignore and fall back
  }
  return defaultFeatureFlags;
}

// Server-side function to get feature flags using the flags SDK
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  try {
    const [artistSearch, debugBanner, tipPromo] = await Promise.all([
      artistSearchEnabled(),
      debugBannerEnabled(),
      tipPromoEnabled(),
    ]);

    return {
      artistSearchEnabled: artistSearch,
      debugBannerEnabled: debugBanner,
      tipPromoEnabled: tipPromo,
    };
  } catch (error) {
    // Log the error but fall back to defaults
    console.warn('Failed to evaluate feature flags:', error);
    return defaultFeatureFlags;
  }
}
