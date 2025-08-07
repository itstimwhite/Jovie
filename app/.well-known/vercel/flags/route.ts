import { NextResponse } from 'next/server';

// Vercel Flags v4 discovery endpoint
// Returns versioned flag definitions so the Toolbar/Flags Explorer can detect the SDK
export async function GET() {
  const response = {
    version: 4,
    // Minimal schema: a map of flag definitions with defaults
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
        default: false,
        description: 'Show debug banner in the UI',
      },
      tipPromoEnabled: {
        type: 'boolean',
        default: true,
        description: 'Enable tip promotion features',
      },
    },
    // Optional metadata for future use
    metadata: {
      app: 'jovie',
      framework: 'next',
      source: 'static-defaults',
    },
  } as const;

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Basic Flags Explorer endpoint for Vercel Toolbar
// Returns known flags and their current values (server-evaluated/defaults)
export async function GET() {
  // Derive values from our current feature flags setup
  const flags = {
    waitlistEnabled: false,
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
  } as const;

  // Include any overrides cookie if present so Toolbar can reconcile
  const cookieStore = await cookies();
  const overrideCookie = cookieStore.get('vercel-flag-overrides')?.value;

  return NextResponse.json(
    {
      // Minimal schema expected by Toolbar: key/value map
      flags,
      // Optional metadata for debugging
      meta: {
        source: 'static-defaults',
        hasOverridesCookie: Boolean(overrideCookie),
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
