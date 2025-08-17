import { NextResponse } from 'next/server';
import { isEnabled } from '@/lib/flags';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple, cache-safe internal flags endpoint for app use
export async function GET() {
  const distinctId = 'api-' + Date.now();

  try {
    const flags = {
      artistSearchEnabled: await isEnabled('artistSearchEnabled', {
        distinctId,
      }),
      debugBannerEnabled: await isEnabled('debugBannerEnabled', { distinctId }),
      tipPromoEnabled: await isEnabled('tipPromoEnabled', { distinctId }),
    } as const;

    return new NextResponse(JSON.stringify(flags), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    console.warn('Failed to fetch flags from PostHog, using defaults:', error);

    // Fallback to defaults if PostHog fails
    const flags = {
      artistSearchEnabled: true,
      debugBannerEnabled: true,
      tipPromoEnabled: true,
    } as const;

    return new NextResponse(JSON.stringify(flags), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });
  }
}
