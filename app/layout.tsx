import type { Metadata } from 'next';
import React from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { VercelToolbar } from '@vercel/toolbar/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { APP_NAME, APP_URL } from '@/constants/app';
import { getServerFeatureFlags } from '@/lib/feature-flags';
import '@/styles/globals.css';
import { StatsigProviderWrapper } from '@/components/providers/StatsigProvider';
import { CookieBannerSection } from '@/components/organisms/CookieBannerSection';
import { headers } from 'next/headers';
// Import performance monitoring
import { initWebVitals } from '@/lib/monitoring/web-vitals';

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
  // Fetch feature flags server-side
  const featureFlags = await getServerFeatureFlags();
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

  // Extract domain from APP_URL for analytics
  const analyticsDomain = APP_URL.replace(/^https?:\/\//, '');

  // Check if cookie banner should be shown
  const headersList = await headers();
  const showCookieBanner = headersList.get('x-show-cookie-banner') === '1';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* DNS Prefetch for critical external resources */}
        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://api.spotify.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.scdn.co" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Vercel Page Speed Insights */}
        <script
          defer
          data-domain={analyticsDomain}
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
      <body className="font-sans">
        <StatsigProviderWrapper>
          <ClientProviders initialFeatureFlags={featureFlags}>
            {children}
          </ClientProviders>
        </StatsigProviderWrapper>
        {showCookieBanner && <CookieBannerSection />}
        <SpeedInsights />
        {shouldInjectToolbar && (
          <>
            <VercelToolbar />
            {/* Performance Dashboard - only shown in development */}
            {process.env.NODE_ENV === 'development' && (
              <div suppressHydrationWarning>
                {/* Dynamic import to avoid SSR issues */}
                {typeof window !== 'undefined' && (
                  <React.Suspense fallback={null}>
                    {/* @ts-ignore - Dynamic import */}
                    {React.createElement(
                      require('@/components/monitoring/PerformanceDashboard')
                        .PerformanceDashboard
                    )}
                  </React.Suspense>
                )}
              </div>
            )}
          </>
        )}
      </body>
    </html>
  );
}
