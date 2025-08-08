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
  debugBannerEnabled: process.env.NODE_ENV === 'development', // Enable in development by default
  tipPromoEnabled: true,
};

// Get feature flags (v4-compatible: attempts fetch from discovery endpoint)
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/.well-known/vercel/flags`,
      {
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        version?: number;
        flags?: Record<string, { default?: unknown }>;
      };
      if (typeof data?.version === 'number') {
        return {
          waitlistEnabled: Boolean(
            data.flags?.waitlistEnabled?.default ??
              defaultFeatureFlags.waitlistEnabled
          ),
          artistSearchEnabled: Boolean(
            data.flags?.artistSearchEnabled?.default ??
              defaultFeatureFlags.artistSearchEnabled
          ),
          debugBannerEnabled: Boolean(
            data.flags?.debugBannerEnabled?.default ??
              defaultFeatureFlags.debugBannerEnabled
          ),
          tipPromoEnabled: Boolean(
            data.flags?.tipPromoEnabled?.default ??
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

// Server-side function to get feature flags
export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  return getFeatureFlags();
}
