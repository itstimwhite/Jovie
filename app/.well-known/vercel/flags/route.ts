import { NextResponse } from 'next/server';

// Vercel Flags v4 discovery endpoint
// Returns versioned flag definitions so the Toolbar/Flags Explorer can detect the SDK
export async function GET() {
  // Enable debug banner in development by default
  const isDevelopment = process.env.NODE_ENV === 'development';

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
        default: isDevelopment, // Enable in development by default
        description: 'Show debug banner in the UI',
      },
      tipPromoEnabled: {
        type: 'boolean',
        default: true,
        description: 'Enable tip promotion features',
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
