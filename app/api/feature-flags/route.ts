import { NextResponse } from 'next/server';
import { getServerFeatureFlagsConfig } from '@/lib/server/feature-flags-config';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Environment-aware feature flags endpoint for app use
export async function GET() {
  // Get flags from environment-aware configuration
  const flags = getServerFeatureFlagsConfig();

  // Add snake_case alias for backward compatibility
  const responseFlags = {
    ...flags,
    // snake_case alias for internal consistency with feature flag naming policy
    feature_click_analytics_rpc: flags.featureClickAnalyticsRpc,
  };

  return new NextResponse(JSON.stringify(responseFlags), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      // Allow caching for a short period to improve performance
      // while ensuring flags update relatively quickly
      'cache-control': 'public, max-age=60, s-maxage=60',
    },
  });
}
