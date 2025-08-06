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
  const { userId } = await auth();
  const geo =
    (req as { geo?: { country?: string; region?: string } }).geo || {};
  const country = geo.country || '';
  const region = geo.region || '';

  let showBanner = false;
  if (EU_EEA_UK.includes(country)) showBanner = true;
  else if (country === 'US' && US_STATES.includes(region)) showBanner = true;
  else if (country === 'CA' && CA_PROVINCES.includes(region)) showBanner = true;

  const res =
    userId && req.nextUrl.pathname === '/'
      ? NextResponse.redirect(new URL('/dashboard', req.url))
      : NextResponse.next();

  if (showBanner) {
    res.headers.set('x-show-cookie-banner', '1');
  }

  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
