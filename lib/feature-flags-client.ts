'use client';

import { FeatureFlags } from './feature-flags';

// Default feature flags (fallback) - client only
const defaultFeatureFlags: FeatureFlags = {
  artistSearchEnabled: true,
  // Debug banner is removed site-wide; keep flag for compatibility but default to false
  debugBannerEnabled: false,
  tipPromoEnabled: true,
  pricingUseClerk: false,
  // Universal notifications only enabled in development for now
  universalNotificationsEnabled: process.env.NODE_ENV === 'development',
  featureClickAnalyticsRpc: false,
  // Progressive onboarding enabled by default for better UX
  progressiveOnboardingEnabled: true,
  // Minimalist design for onboarding screens (Apple-inspired)
  minimalistOnboardingEnabled: true,
  // New Apple-style full-screen onboarding with improved UX (JOV-134)
  appleStyleOnboardingEnabled: true,
  // Venmo tip button in profile footer (JOV-146)
  venmoTipButtonEnabled: true,
};

// Client-side only feature flags function
export async function getClientFeatureFlags(): Promise<FeatureFlags> {
  // On the client, prefer the internal app flags endpoint; fall back to Vercel discovery locally
  // 1) Try app-internal endpoint
  try {
    const res = await fetch('/api/feature-flags', { cache: 'no-store' });
    if (res.ok) {
      const data: Record<string, unknown> = await res.json();
      // New app-internal shape: direct booleans
      const hasRpcFlag =
        Object.prototype.hasOwnProperty.call(
          data,
          'featureClickAnalyticsRpc'
        ) ||
        Object.prototype.hasOwnProperty.call(
          data,
          'feature_click_analytics_rpc'
        );
      if (
        typeof data?.artistSearchEnabled !== 'undefined' ||
        typeof data?.debugBannerEnabled !== 'undefined' ||
        typeof data?.tipPromoEnabled !== 'undefined' ||
        typeof data?.universalNotificationsEnabled !== 'undefined' ||
        typeof data?.progressiveOnboardingEnabled !== 'undefined' ||
        hasRpcFlag
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
          pricingUseClerk: Boolean(
            data.pricingUseClerk ?? defaultFeatureFlags.pricingUseClerk
          ),
          universalNotificationsEnabled: Boolean(
            data.universalNotificationsEnabled ??
              defaultFeatureFlags.universalNotificationsEnabled
          ),
          progressiveOnboardingEnabled: Boolean(
            data.progressiveOnboardingEnabled ??
              defaultFeatureFlags.progressiveOnboardingEnabled
          ),
          minimalistOnboardingEnabled: Boolean(
            data.minimalistOnboardingEnabled ??
              defaultFeatureFlags.minimalistOnboardingEnabled
          ),
          appleStyleOnboardingEnabled: Boolean(
            data.appleStyleOnboardingEnabled ??
              defaultFeatureFlags.appleStyleOnboardingEnabled
          ),
          venmoTipButtonEnabled: Boolean(
            data.venmoTipButtonEnabled ??
              defaultFeatureFlags.venmoTipButtonEnabled
          ),
          featureClickAnalyticsRpc: Boolean(
            hasRpcFlag
              ? ((data as Record<string, unknown>)[
                  'featureClickAnalyticsRpc'
                ] ??
                  (data as Record<string, unknown>)[
                    'feature_click_analytics_rpc'
                  ])
              : defaultFeatureFlags.featureClickAnalyticsRpc
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
        const rpcFlag =
          data2.flags?.['featureClickAnalyticsRpc']?.default ??
          data2.flags?.['feature_click_analytics_rpc']?.default;
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
          pricingUseClerk: Boolean(
            data2.flags?.pricingUseClerk?.default ??
              defaultFeatureFlags.pricingUseClerk
          ),
          universalNotificationsEnabled: Boolean(
            data2.flags?.universalNotificationsEnabled?.default ??
              defaultFeatureFlags.universalNotificationsEnabled
          ),
          featureClickAnalyticsRpc: Boolean(
            typeof rpcFlag !== 'undefined'
              ? rpcFlag
              : defaultFeatureFlags.featureClickAnalyticsRpc
          ),
          progressiveOnboardingEnabled: Boolean(
            data2.flags?.progressiveOnboardingEnabled?.default ??
              defaultFeatureFlags.progressiveOnboardingEnabled
          ),
          minimalistOnboardingEnabled: Boolean(
            data2.flags?.minimalistOnboardingEnabled?.default ??
              defaultFeatureFlags.minimalistOnboardingEnabled
          ),
          appleStyleOnboardingEnabled: Boolean(
            data2.flags?.appleStyleOnboardingEnabled?.default ??
              defaultFeatureFlags.appleStyleOnboardingEnabled
          ),
          venmoTipButtonEnabled: Boolean(
            data2.flags?.venmoTipButtonEnabled?.default ??
              defaultFeatureFlags.venmoTipButtonEnabled
          ),
        };
      }
    }
  } catch {
    // ignore
  }
  return defaultFeatureFlags;
}