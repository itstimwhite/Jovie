import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to parse boolean environment variables
const parseBoolEnv = (
  value: string | undefined,
  defaultValue: boolean
): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Simple, cache-safe internal flags endpoint for app use
export async function GET() {
  // Define default values for all feature flags
  const defaults = {
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
    pricingUseClerk: false,
    universalNotificationsEnabled: process.env.NODE_ENV === 'development',
    featureClickAnalyticsRpc: false,
  };

  // Read from environment variables with fallbacks to defaults
  const flags = {
    // camelCase keys (primary)
    artistSearchEnabled: parseBoolEnv(
      process.env.FEATURE_ARTIST_SEARCH,
      defaults.artistSearchEnabled
    ),
    debugBannerEnabled: parseBoolEnv(
      process.env.FEATURE_DEBUG_BANNER,
      defaults.debugBannerEnabled
    ),
    tipPromoEnabled: parseBoolEnv(
      process.env.NEXT_PUBLIC_FEATURE_TIPS,
      defaults.tipPromoEnabled
    ),
    pricingUseClerk: parseBoolEnv(
      process.env.FEATURE_PRICING_USE_CLERK,
      defaults.pricingUseClerk
    ),
    universalNotificationsEnabled: parseBoolEnv(
      process.env.FEATURE_UNIVERSAL_NOTIFICATIONS,
      defaults.universalNotificationsEnabled
    ),
    // Gate for anonymous click logging via SECURITY DEFINER RPC
    featureClickAnalyticsRpc: parseBoolEnv(
      process.env.FEATURE_CLICK_ANALYTICS_RPC,
      defaults.featureClickAnalyticsRpc
    ),
  } as const;

  // Generate snake_case aliases for all camelCase keys
  const snakeCaseAliases = Object.entries(flags).reduce(
    (acc, [key, value]) => {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      acc[snakeKey] = value;
      return acc;
    },
    {} as Record<string, boolean>
  );

  // Combine camelCase keys with snake_case aliases
  const combinedFlags = {
    ...flags,
    ...snakeCaseAliases,
  };

  return new NextResponse(JSON.stringify(combinedFlags), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
