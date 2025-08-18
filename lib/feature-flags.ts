// Feature flags interface
export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
}

// Default feature flags (fallback)
const defaultFeatureFlags: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: false,
  tipPromoEnabled: true,
};

// Get feature flags (v4-compatible: attempts fetch from discovery endpoint)
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // On the server, delegate to the robust absolute-URL variant
  if (typeof window === 'undefined') {
    return getServerFeatureFlags();
  }
  // On the client, fetch relative to current origin
  try {
    const res = await fetch('/.well-known/vercel/flags');
    if (res.ok) {
      const data = (await res.json()) as {
        version?: number;
        flags?: Record<string, { default?: unknown }>;
      };
      if (typeof data?.version === 'number') {
        return {
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

    const url = `${proto}://${host}/.well-known/vercel/flags`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = (await res.json()) as {
        version?: number;
        flags?: Record<string, { default?: unknown }>;
      };
      if (typeof data?.version === 'number') {
        return {
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
    // fallthrough to defaults
  }
  return defaultFeatureFlags;
}
