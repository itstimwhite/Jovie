// Feature flags interface
export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
  pricingUseClerk: boolean;
  universalNotificationsEnabled: boolean;
  // Gate new anonymous click logging via SECURITY DEFINER RPC
  featureClickAnalyticsRpc: boolean;
  // Progressive onboarding with multi-step UX improvements
  progressiveOnboardingEnabled: boolean;
  // Minimalist design for onboarding screens (Apple-inspired)
  minimalistOnboardingEnabled?: boolean;
  // New Apple-style full-screen onboarding with improved UX (JOV-134)
  appleStyleOnboardingEnabled?: boolean;
  // Venmo tip button in profile footer (JOV-146)
  venmoTipButtonEnabled?: boolean;
}

// PostHog feature flag names (match what's defined in PostHog dashboard)
export const POSTHOG_FLAGS = {
  ARTIST_SEARCH_ENABLED: 'feature_artist_search_enabled',
  DEBUG_BANNER_ENABLED: 'feature_debug_banner_enabled',
  TIP_PROMO_ENABLED: 'feature_tip_promo_enabled',
  PRICING_USE_CLERK: 'feature_pricing_use_clerk',
  UNIVERSAL_NOTIFICATIONS_ENABLED: 'feature_universal_notifications_enabled',
  FEATURE_CLICK_ANALYTICS_RPC: 'feature_click_analytics_rpc',
  PROGRESSIVE_ONBOARDING_ENABLED: 'feature_progressive_onboarding_enabled',
  MINIMALIST_ONBOARDING_ENABLED: 'feature_minimalist_onboarding_enabled',
  APPLE_STYLE_ONBOARDING_ENABLED: 'feature_apple_style_onboarding_enabled',
  VENMO_TIP_BUTTON_ENABLED: 'feature_venmo_tip_button_enabled',
} as const;

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
  // Progressive onboarding enabled by default for better UX
  progressiveOnboardingEnabled: true,
  // Minimalist design for onboarding screens (Apple-inspired)
  minimalistOnboardingEnabled: true,
  // New Apple-style full-screen onboarding with improved UX (JOV-134)
  appleStyleOnboardingEnabled: true,
  // Venmo tip button in profile footer (JOV-146)
  venmoTipButtonEnabled: true,
};

// Server-side feature flags function
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // This function should only be used on the server
  if (typeof window !== 'undefined') {
    throw new Error('getFeatureFlags should not be called on the client. Use getClientFeatureFlags from @/lib/feature-flags-client instead.');
  }
  return getServerFeatureFlags();
}

// Server-side PostHog feature flag helper
async function getPostHogServerFlags(
  userId?: string
): Promise<Partial<FeatureFlags>> {
  try {
    // Dynamically import PostHog to avoid bundling in client
    const { PostHog } = await import('posthog-node');
    const { ANALYTICS } = await import('@/constants/app');

    if (!ANALYTICS.posthogKey) {
      return {};
    }

    const client = new PostHog(ANALYTICS.posthogKey, {
      host: ANALYTICS.posthogHost || 'https://us.posthog.com',
    });

    const distinctId = userId || 'anonymous';

    // Check each PostHog feature flag
    const [
      artistSearchEnabled,
      debugBannerEnabled,
      tipPromoEnabled,
      pricingUseClerk,
      universalNotificationsEnabled,
      featureClickAnalyticsRpc,
      progressiveOnboardingEnabled,
      minimalistOnboardingEnabled,
      appleStyleOnboardingEnabled,
      venmoTipButtonEnabled,
    ] = await Promise.all([
      client.isFeatureEnabled(POSTHOG_FLAGS.ARTIST_SEARCH_ENABLED, distinctId),
      client.isFeatureEnabled(POSTHOG_FLAGS.DEBUG_BANNER_ENABLED, distinctId),
      client.isFeatureEnabled(POSTHOG_FLAGS.TIP_PROMO_ENABLED, distinctId),
      client.isFeatureEnabled(POSTHOG_FLAGS.PRICING_USE_CLERK, distinctId),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.UNIVERSAL_NOTIFICATIONS_ENABLED,
        distinctId
      ),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.FEATURE_CLICK_ANALYTICS_RPC,
        distinctId
      ),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.PROGRESSIVE_ONBOARDING_ENABLED,
        distinctId
      ),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.MINIMALIST_ONBOARDING_ENABLED,
        distinctId
      ),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.APPLE_STYLE_ONBOARDING_ENABLED,
        distinctId
      ),
      client.isFeatureEnabled(
        POSTHOG_FLAGS.VENMO_TIP_BUTTON_ENABLED,
        distinctId
      ),
    ]);

    await client.shutdown();

    return {
      ...(typeof artistSearchEnabled === 'boolean' && { artistSearchEnabled }),
      ...(typeof debugBannerEnabled === 'boolean' && { debugBannerEnabled }),
      ...(typeof tipPromoEnabled === 'boolean' && { tipPromoEnabled }),
      ...(typeof pricingUseClerk === 'boolean' && { pricingUseClerk }),
      ...(typeof universalNotificationsEnabled === 'boolean' && {
        universalNotificationsEnabled,
      }),
      ...(typeof featureClickAnalyticsRpc === 'boolean' && {
        featureClickAnalyticsRpc,
      }),
      ...(typeof progressiveOnboardingEnabled === 'boolean' && {
        progressiveOnboardingEnabled,
      }),
      ...(typeof minimalistOnboardingEnabled === 'boolean' && {
        minimalistOnboardingEnabled,
      }),
      ...(typeof appleStyleOnboardingEnabled === 'boolean' && {
        appleStyleOnboardingEnabled,
      }),
      ...(typeof venmoTipButtonEnabled === 'boolean' && {
        venmoTipButtonEnabled,
      }),
    };
  } catch (error) {
    console.warn('[Feature Flags] PostHog server flags failed:', error);
    return {};
  }
}

// Server-side function to get feature flags
export async function getServerFeatureFlags(
  userId?: string
): Promise<FeatureFlags> {
  try {
    // 1) Try PostHog server-side feature flags first
    const postHogFlags = await getPostHogServerFlags(userId);

    // 2) Try app-internal endpoint as fallback
    const { headers } = await import('next/headers');
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto =
      h.get('x-forwarded-proto') ??
      (host && host.includes('localhost') ? 'http' : 'https');

    let localFlags: Partial<FeatureFlags> = {};

    if (host) {
      try {
        const url = `${proto}://${host}/api/feature-flags`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data: Record<string, unknown> = await res.json();
          localFlags = {
            artistSearchEnabled: Boolean(data.artistSearchEnabled),
            debugBannerEnabled: Boolean(data.debugBannerEnabled),
            tipPromoEnabled: Boolean(data.tipPromoEnabled),
            pricingUseClerk: Boolean(data.pricingUseClerk),
            universalNotificationsEnabled: Boolean(
              data.universalNotificationsEnabled
            ),
            progressiveOnboardingEnabled: Boolean(
              data.progressiveOnboardingEnabled
            ),
            minimalistOnboardingEnabled: Boolean(
              data.minimalistOnboardingEnabled
            ),
            appleStyleOnboardingEnabled: Boolean(
              data.appleStyleOnboardingEnabled
            ),
            venmoTipButtonEnabled: Boolean(
              data.venmoTipButtonEnabled
            ),
            featureClickAnalyticsRpc: Boolean(
              data.featureClickAnalyticsRpc || data.feature_click_analytics_rpc
            ),
          };
        }
      } catch {
        // ignore fetch errors
      }
    }

    // 3) Merge flags with priority: PostHog > Local > Defaults
    return {
      artistSearchEnabled:
        postHogFlags.artistSearchEnabled ??
        localFlags.artistSearchEnabled ??
        defaultFeatureFlags.artistSearchEnabled,
      debugBannerEnabled:
        postHogFlags.debugBannerEnabled ??
        localFlags.debugBannerEnabled ??
        defaultFeatureFlags.debugBannerEnabled,
      tipPromoEnabled:
        postHogFlags.tipPromoEnabled ??
        localFlags.tipPromoEnabled ??
        defaultFeatureFlags.tipPromoEnabled,
      pricingUseClerk:
        postHogFlags.pricingUseClerk ??
        localFlags.pricingUseClerk ??
        defaultFeatureFlags.pricingUseClerk,
      universalNotificationsEnabled:
        postHogFlags.universalNotificationsEnabled ??
        localFlags.universalNotificationsEnabled ??
        defaultFeatureFlags.universalNotificationsEnabled,
      featureClickAnalyticsRpc:
        postHogFlags.featureClickAnalyticsRpc ??
        localFlags.featureClickAnalyticsRpc ??
        defaultFeatureFlags.featureClickAnalyticsRpc,
      progressiveOnboardingEnabled:
        postHogFlags.progressiveOnboardingEnabled ??
        localFlags.progressiveOnboardingEnabled ??
        defaultFeatureFlags.progressiveOnboardingEnabled,
      minimalistOnboardingEnabled:
        postHogFlags.minimalistOnboardingEnabled ??
        localFlags.minimalistOnboardingEnabled ??
        defaultFeatureFlags.minimalistOnboardingEnabled,
      appleStyleOnboardingEnabled:
        postHogFlags.appleStyleOnboardingEnabled ??
        localFlags.appleStyleOnboardingEnabled ??
        defaultFeatureFlags.appleStyleOnboardingEnabled,
      venmoTipButtonEnabled:
        postHogFlags.venmoTipButtonEnabled ??
        localFlags.venmoTipButtonEnabled ??
        defaultFeatureFlags.venmoTipButtonEnabled,
    };
  } catch (error) {
    console.warn('[Feature Flags] Server flags failed:', error);
    return defaultFeatureFlags;
  }
}
