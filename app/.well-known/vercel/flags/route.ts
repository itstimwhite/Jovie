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
