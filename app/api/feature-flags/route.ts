import { NextResponse } from 'next/server';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple, cache-safe internal flags endpoint for app use
export async function GET() {
  // Define flags using canonical snake_case keys
  const flags = {
    // Canonical snake_case keys (source of truth)
    [FEATURE_FLAGS.ARTIST_SEARCH]: true,
    [FEATURE_FLAGS.DEBUG_BANNER]: false,
    [FEATURE_FLAGS.TIP_PROMO]: true,
    [FEATURE_FLAGS.PRICING_CLERK]: false,
    [FEATURE_FLAGS.UNIVERSAL_NOTIFICATIONS]:
      process.env.NODE_ENV === 'development',
    [FEATURE_FLAGS.CLICK_ANALYTICS_RPC]: false,
    [FEATURE_FLAGS.CLAIM_HANDLE]: false,

    // Legacy camelCase keys (for backward compatibility)
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
    pricingUseClerk: false,
    universalNotificationsEnabled: process.env.NODE_ENV === 'development',
    featureClickAnalyticsRpc: false,
    claimHandleEnabled: false,
  } as const;

  return new NextResponse(JSON.stringify(flags), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
