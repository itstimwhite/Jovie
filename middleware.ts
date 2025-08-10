import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const EU_EEA_UK = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IS',
  'IE',
  'IT',
  'LV',
  'LI',
  'LT',
  'LU',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
];
const US_STATES = ['CA', 'CO', 'VA', 'CT', 'UT'];
const CA_PROVINCES = ['QC'];

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();

    // Safely access geo information
    let country = '';
    let region = '';
    try {
      const geo = (req as { geo?: { country?: string; region?: string } }).geo;
      if (geo && typeof geo === 'object') {
        country = geo.country || '';
        region = geo.region || '';
      }
    } catch {
      // Ignore geo errors
    }

    let showBanner = false;
    if (EU_EEA_UK.includes(country)) showBanner = true;
    else if (country === 'US' && US_STATES.includes(region)) showBanner = true;
    else if (country === 'CA' && CA_PROVINCES.includes(region))
      showBanner = true;

    let res: NextResponse;

    // Handle authenticated user redirects
    if (userId) {
      if (req.nextUrl.pathname === '/') {
        res = NextResponse.redirect(new URL('/dashboard', req.url));
      } else if (req.nextUrl.pathname === '/billing/success') {
        // Allow access to billing success page for authenticated users
        res = NextResponse.next();
      } else {
        res = NextResponse.next();
      }
    } else {
      // Handle unauthenticated users
      if (req.nextUrl.pathname === '/billing/success') {
        // Redirect non-authenticated users away from billing success
        res = NextResponse.redirect(new URL('/dashboard', req.url));
      } else {
        res = NextResponse.next();
      }
    }

    if (showBanner) {
      res.headers.set('x-show-cookie-banner', '1');
    }

    return res;
  } catch {
    // Fallback to basic middleware behavior if Clerk auth fails
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals, all static files, and .well-known directory
    '/((?!_next|\\.well-known|.*\\.(?:html?|css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
