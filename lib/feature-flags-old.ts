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
      const data: any = await res.json();
      // New app-internal shape: direct booleans
      if (
        typeof data?.artistSearchEnabled !== 'undefined' ||
        typeof data?.debugBannerEnabled !== 'undefined' ||
        typeof data?.tipPromoEnabled !== 'undefined'
      ) {
        return {
          artistSearchEnabled: Boolean(
            data.artistSearchEnabled ?? defaultFeatureFlags.artistSearchEnabled
          ),
          debugBannerEnabled: Boolean(
            data.debugBannerEnabled ?? defaultFeatureFlags.debugBannerEnabled
          ),
          tipPromoEnabled: Boolean(
            data.tipPromoEnabled ?? defaultFeatureFlags.tipPromoEnabled
          ),
        };
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
      if (typeof data2?.version === 'number') {
        return {
          artistSearchEnabled: Boolean(
            data2.flags?.artistSearchEnabled?.default ??
              defaultFeatureFlags.artistSearchEnabled
          ),
          debugBannerEnabled: Boolean(
            data2.flags?.debugBannerEnabled?.default ??
              defaultFeatureFlags.debugBannerEnabled
          ),
          tipPromoEnabled: Boolean(
            data2.flags?.tipPromoEnabled?.default ??
              defaultFeatureFlags.tipPromoEnabled
          ),
        };
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
      const data: any = await res.json();
      if (
        typeof data?.artistSearchEnabled !== 'undefined' ||
        typeof data?.debugBannerEnabled !== 'undefined' ||
        typeof data?.tipPromoEnabled !== 'undefined'
      ) {
        return {
          artistSearchEnabled: Boolean(
            data.artistSearchEnabled ?? defaultFeatureFlags.artistSearchEnabled
          ),
          debugBannerEnabled: Boolean(
            data.debugBannerEnabled ?? defaultFeatureFlags.debugBannerEnabled
          ),
          tipPromoEnabled: Boolean(
            data.tipPromoEnabled ?? defaultFeatureFlags.tipPromoEnabled
          ),
        };
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
