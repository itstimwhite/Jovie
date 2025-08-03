import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HomeHero } from '@/components/home/HomeHero';
import { FeaturedArtists } from '@/components/home/FeaturedArtists';
import { APP_NAME, APP_URL } from '@/constants/app';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const title = `${APP_NAME} - Link in bio for music artists`;
  const description = 'Connect your music, social media, and merch in one link. No design needed. Live in under 90 seconds.';
  const keywords = [
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
  ];

  return {
    title,
    description,
    keywords,
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
      title,
      description,
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
      title,
      description,
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
    other: {
      'music:musician': APP_URL,
      'music:album': APP_URL,
    },
  };
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: APP_NAME,
            description: 'Link in bio for music artists',
            url: APP_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${APP_URL}/?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: APP_NAME,
              url: APP_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${APP_URL}/brand/jovie-logo.svg`,
              },
            },
            sameAs: [
              'https://twitter.com/jovie',
              'https://instagram.com/jovie',
            ],
          }),
        }}
      />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        </div>

        {/* Hero Section */}
        <HomeHero />

        {/* Featured Artists Carousel */}
        <Suspense
          fallback={
            <div className="py-16 text-center text-white">
              Loading featured artists...
            </div>
          }
        >
          <FeaturedArtists />
        </Suspense>
      </div>
    </>
  );
}
