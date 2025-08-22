import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple, cache-safe internal flags endpoint for app use
export async function GET() {
  const flags = {
    // Original flags
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
    pricingUseClerk: false,
    universalNotificationsEnabled: process.env.NODE_ENV === 'development',
    // Gate for anonymous click logging via SECURITY DEFINER RPC
    featureClickAnalyticsRpc: false,
    // snake_case alias for internal consistency with feature flag naming policy
    feature_click_analytics_rpc: false,

    // New MVP flags (snake_case format as per requirements)
    feature_claim_handle: false, // default OFF
    feature_artist_search: true, // default ON
    feature_tip_promo: true, // default ON
    feature_pricing_clerk: false, // default OFF
    feature_universal_notifications: process.env.NODE_ENV === 'development', // default DEV-only
    // feature_click_analytics_rpc already defined above
    feature_anti_cloaking_interstitial: true, // default ON
  } as const;

  return new NextResponse(JSON.stringify(flags), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
