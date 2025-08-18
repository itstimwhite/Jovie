import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Vercel Flags v4 discovery endpoint
// Returns versioned flag definitions so the Toolbar/Flags Explorer can detect the SDK
export async function GET() {
  // Discovery endpoint returns static defaults (no env branching)

  const response = {
    version: 4,
    flags: {
      waitlistEnabled: {
        type: 'boolean',
        default: false,
        description: 'Controls waitlist flow visibility',
      },
      artistSearchEnabled: {
        type: 'boolean',
        default: true,
        description: 'Enable artist search UI (replaced by claim flow)',
      },
      debugBannerEnabled: {
        type: 'boolean',
        default: false, // UI banner removed; kept for API compatibility
        description:
          'Deprecated: legacy UI debug banner (replaced by console logger)',
      },
      tipPromoEnabled: {
        type: 'boolean',
        default: true,
        description: 'Enable tip promotion features',
      },
      feature_claim_handle: {
        type: 'boolean',
        default: false,
        description:
          'Gate the Claim Handle input on homepage; when false, show Sign Up button instead',
      },
    },
    metadata: {
      app: 'jovie',
      framework: 'next',
      source: 'static-defaults',
    },
  } as const;

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
