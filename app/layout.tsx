import type { Metadata } from 'next';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { APP_NAME, APP_URL } from '@/constants/app';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Link in bio for music artists`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Connect your music, social media, and merch in one link. No design needed. Live in under 90 seconds.',
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
    'fan engagement'
  ],
  authors: [
    {
      name: APP_NAME,
      url: APP_URL,
    },
  ],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: `${APP_NAME} - Link in bio for music artists`,
    description: 'Connect your music, social media, and merch in one link. No design needed. Live in under 90 seconds.',
    siteName: APP_NAME,
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Link in bio for music artists`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Link in bio for music artists`,
    description: 'Connect your music, social media, and merch in one link. No design needed. Live in under 90 seconds.',
    images: ['/og/default.png'],
    creator: '@jovie',
    site: '@jovie',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'music:musician': APP_URL,
    'music:album': APP_URL,
    'theme-color': '#6366f1',
    'msapplication-TileColor': '#6366f1',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': APP_NAME,
    'mobile-web-app-capable': 'yes',
    'application-name': APP_NAME,
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.scdn.co" />
        <link rel="preconnect" href="https://api.spotify.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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
              logo: {
                '@type': 'ImageObject',
                url: `${APP_URL}/brand/jovie-logo.svg`,
                width: 136,
                height: 39,
              },
              description: 'Link in bio for music artists',
              sameAs: [
                'https://twitter.com/jovie',
                'https://instagram.com/jovie',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: APP_URL,
              },
            }),
          }}
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
