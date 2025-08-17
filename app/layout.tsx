import type { Metadata } from 'next';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { VercelToolbar } from '@vercel/toolbar/next';

import { APP_NAME, APP_URL } from '@/constants/app';
import { FlagProvider, getServerFeatureFlags } from '@/lib/flags';
import { getAllServerFlags } from '@/lib/posthog/server';
import '@/styles/globals.css';

// Bypass static rendering for now to fix build issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Link in bio for music artists. Connect your music, social media, and merch in one link. No design needed.',
  keywords: [
    'link in bio',
    'music artist',
    'spotify',
    'social media',
    'music promotion',
    'artist profile',
    'music marketing',
    'streaming',
    'music links',
    'artist bio',
    'music discovery',
    'fan engagement',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: APP_NAME,
    description:
      'Link in bio for music artists. Connect your music, social media, and merch in one link. No design needed.',
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og/default.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description:
      'Link in bio for music artists. Connect your music, social media, and merch in one link. No design needed.',
    images: [`${APP_URL}/og/default.png`],
    creator: '@jovie',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': APP_NAME,
    'application-name': APP_NAME,
    'msapplication-TileColor': '#6366f1',
    'theme-color': '#ffffff',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch feature flags server-side with PostHog
  const distinctId = 'anonymous-' + Date.now(); // In real app, get from session/user ID or cookie
  const allFlags: Record<string, boolean | string> = {};
  let featureFlags;

  try {
    // Get all flags from PostHog for bootstrapping
    const rawFlags = await getAllServerFlags(distinctId);
    // Filter and convert flags to the expected type
    Object.entries(rawFlags).forEach(([key, value]) => {
      if (typeof value === 'boolean' || typeof value === 'string') {
        allFlags[key] = value;
      }
    });
    // Get compatibility flags for existing providers
    featureFlags = await getServerFeatureFlags();
  } catch (error) {
    console.warn('Failed to fetch feature flags, using defaults:', error);
    // Use default flags if PostHog fails
    featureFlags = {
      artistSearchEnabled: true,
      debugBannerEnabled: true,
      tipPromoEnabled: true,
    };
  }

  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://api.spotify.com" />

        {/* Vercel Page Speed Insights */}
        <script
          defer
          data-domain="jov.ie"
          src="https://vitals.vercel-insights.com/v1/vitals.js"
        />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: APP_NAME,
              url: APP_URL,
              logo: `${APP_URL}/brand/jovie-logo.svg`,
              description:
                'Link in bio for music artists. Connect your music, social media, and merch in one link.',
              sameAs: [
                'https://twitter.com/jovie',
                'https://instagram.com/jovie',
              ],
            }),
          }}
        />
      </head>
      <body
        className="font-sans"
        style={{ paddingTop: 'var(--debug-banner-height, 3rem)' }}
      >
        <FlagProvider flags={allFlags}>
          <ClientProviders initialFeatureFlags={featureFlags}>
            {children}
          </ClientProviders>
        </FlagProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
