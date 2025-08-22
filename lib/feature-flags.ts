// Canonical feature flag keys in snake_case
export const FEATURE_FLAGS = {
  ARTIST_SEARCH: 'feature_artist_search',
  DEBUG_BANNER: 'feature_debug_banner',
  TIP_PROMO: 'feature_tip_promo',
  PRICING_CLERK: 'feature_pricing_clerk',
  UNIVERSAL_NOTIFICATIONS: 'feature_universal_notifications',
  CLICK_ANALYTICS_RPC: 'feature_click_analytics_rpc',
  CLAIM_HANDLE: 'feature_claim_handle',
} as const;

// Type for canonical feature flag keys
export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

// Feature flags interface with camelCase for TypeScript ergonomics
export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
  pricingUseClerk: boolean;
  universalNotificationsEnabled: boolean;
  featureClickAnalyticsRpc: boolean;
  claimHandleEnabled: boolean;
}

// Mapping between snake_case keys and camelCase properties
const flagKeyToProperty: Record<FeatureFlagKey, keyof FeatureFlags> = {
  [FEATURE_FLAGS.ARTIST_SEARCH]: 'artistSearchEnabled',
  [FEATURE_FLAGS.DEBUG_BANNER]: 'debugBannerEnabled',
  [FEATURE_FLAGS.TIP_PROMO]: 'tipPromoEnabled',
  [FEATURE_FLAGS.PRICING_CLERK]: 'pricingUseClerk',
  [FEATURE_FLAGS.UNIVERSAL_NOTIFICATIONS]: 'universalNotificationsEnabled',
  [FEATURE_FLAGS.CLICK_ANALYTICS_RPC]: 'featureClickAnalyticsRpc',
  [FEATURE_FLAGS.CLAIM_HANDLE]: 'claimHandleEnabled',
};

// Reverse mapping from camelCase properties to snake_case keys
const propertyToFlagKey: Record<keyof FeatureFlags, FeatureFlagKey> =
  Object.entries(flagKeyToProperty).reduce(
    (acc, [key, value]) => {
      acc[value as keyof FeatureFlags] = key as FeatureFlagKey;
      return acc;
    },
    {} as Record<keyof FeatureFlags, FeatureFlagKey>
  );

// Default feature flags (fallback)
const defaultFeatureFlags: FeatureFlags = {
  artistSearchEnabled: true,
  // Debug banner is removed site-wide; keep flag for compatibility but default to false
  debugBannerEnabled: false,
  tipPromoEnabled: true,
  pricingUseClerk: false,
  // Universal notifications only enabled in development for now
  universalNotificationsEnabled: process.env.NODE_ENV === 'development',
  featureClickAnalyticsRpc: false,
  claimHandleEnabled: false,
};

// Helper function to convert snake_case data to camelCase FeatureFlags
function convertToFeatureFlags(data: Record<string, unknown>): FeatureFlags {
  const result = { ...defaultFeatureFlags };

  // Process snake_case keys
  Object.values(FEATURE_FLAGS).forEach((snakeKey) => {
    if (Object.prototype.hasOwnProperty.call(data, snakeKey)) {
      const camelKey = flagKeyToProperty[snakeKey as FeatureFlagKey];
      result[camelKey] = Boolean(data[snakeKey]);
    }
  });

  // Process legacy camelCase keys for backward compatibility
  Object.keys(defaultFeatureFlags).forEach((camelKey) => {
    if (Object.prototype.hasOwnProperty.call(data, camelKey)) {
      (result as Record<string, boolean>)[camelKey] = Boolean(data[camelKey]);
    }
  });

  return result;
}

// Get feature flags (v4-compatible: attempts fetch from discovery endpoint)
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // On the server, delegate to the robust absolute-URL variant
  if (typeof window === 'undefined') {
    return getServerFeatureFlags();
  }
  // On the client, prefer the internal app flags endpoint; fall back to Vercel discovery locally
  // 1) Try app-internal endpoint
  try {
    const res = await fetch('/api/feature-flags', { cache: 'no-store' });
    if (res.ok) {
      const data: Record<string, unknown> = await res.json();
      // Check if we have any feature flags in the response
      const hasAnyFlag =
        Object.keys(FEATURE_FLAGS).some(
          (_, i) => Object.values(FEATURE_FLAGS)[i] in data
        ) || Object.keys(defaultFeatureFlags).some((key) => key in data);

      if (hasAnyFlag) {
        return convertToFeatureFlags(data);
      }
    }
  } catch {
    // ignore
  }
  // 2) Fallback: try Vercel discovery (works in dev/local; may be blocked in Preview/Prod)
  try {
    const res2 = await fetch('/.well-known/vercel/flags', {
      cache: 'no-store',
    });
    if (res2.ok) {
      const data2 = (await res2.json()) as {
        version?: number;
        flags?: Record<string, { default?: unknown }>;
      };
      if (typeof data2?.version === 'number' && data2.flags) {
        // Convert Vercel flags format to our format
        const flattenedData: Record<string, unknown> = {};

        // Process both snake_case and camelCase keys
        Object.entries(data2.flags).forEach(([key, value]) => {
          flattenedData[key] = value.default;
        });

        return convertToFeatureFlags(flattenedData);
      }
    }
  } catch {
    // ignore
  }
  return defaultFeatureFlags;
}

// Server-side function to get feature flags
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  try {
    // Dynamically import to avoid bundling in client
    const { headers } = await import('next/headers');
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto =
      h.get('x-forwarded-proto') ??
      (host && host.includes('localhost') ? 'http' : 'https');

    if (!host) {
      return defaultFeatureFlags;
    }

    // 1) Try app-internal endpoint first
    let url = `${proto}://${host}/api/feature-flags`;
    let res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data: Record<string, unknown> = await res.json();
      // Check if we have any feature flags in the response
      const hasAnyFlag =
        Object.keys(FEATURE_FLAGS).some(
          (_, i) => Object.values(FEATURE_FLAGS)[i] in data
        ) || Object.keys(defaultFeatureFlags).some((key) => key in data);

      if (hasAnyFlag) {
        return convertToFeatureFlags(data);
      }
    }

    // 2) Fallback to Vercel discovery (may be blocked in Preview/Prod)
    url = `${proto}://${host}/.well-known/vercel/flags`;
    res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = (await res.json()) as {
        version?: number;
        flags?: Record<string, { default?: unknown }>;
      };
      if (typeof data?.version === 'number' && data.flags) {
        // Convert Vercel flags format to our format
        const flattenedData: Record<string, unknown> = {};

        // Process both snake_case and camelCase keys
        Object.entries(data.flags).forEach(([key, value]) => {
          flattenedData[key] = value.default;
        });

        return convertToFeatureFlags(flattenedData);
      }
    }
  } catch {
    // fallthrough to defaults
  }
  return defaultFeatureFlags;
}

// Helper function to get a feature flag value by its canonical snake_case key
export function getFeatureFlagByKey(
  flags: FeatureFlags,
  key: FeatureFlagKey
): boolean {
  const propertyName = flagKeyToProperty[key];
  return flags[propertyName];
}

// Helper function to get the canonical snake_case key for a camelCase property
export function getKeyForFeatureFlag(
  propertyName: keyof FeatureFlags
): FeatureFlagKey {
  return propertyToFlagKey[propertyName];
}
