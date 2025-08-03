import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ListenNow } from '@/components/profile/ListenNow';
import { SocialBar } from '@/components/profile/SocialBar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { Container } from '@/components/site/Container';
import { ArtistSEO } from '@/components/seo/ArtistSEO';
import { Artist, SocialLink } from '@/types/db';
import { APP_NAME, APP_URL } from '@/constants/app';

// Root layout handles dynamic rendering
export const revalidate = 3600; // Revalidate every hour

interface ProfilePageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { handle } = await params;
  const supabase = await createServerClient();

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist profile could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${artist.name} | ${APP_NAME}`;
  const description =
    artist.tagline ||
    `Listen to ${artist.name}'s music and discover their latest releases.`;
  const imageUrl = artist.image_url || `${APP_URL}/og/default.png`;
  const profileUrl = `${APP_URL}/${artist.handle}`;

  return {
    title,
    description,
    keywords: [
      artist.name,
      'music',
      'artist',
      'spotify',
      'listen',
      'stream',
      'music artist',
      'musician',
      artist.tagline || '',
      ...(artist.is_verified ? ['verified', 'authentic'] : []),
    ].filter(Boolean),
    authors: [{ name: artist.name }],
    creator: artist.name,
    publisher: APP_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: artist.name,
      description,
      url: profileUrl,
      siteName: APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${artist.name} - Music Artist`,
        },
      ],
      locale: 'en_US',
      type: 'profile',
      profile: {
        firstName: artist.name.split(' ')[0],
        lastName: artist.name.split(' ').slice(1).join(' '),
        username: artist.handle,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: artist.name,
      description,
      images: [imageUrl],
      creator: '@jovieapp',
      site: '@jovieapp',
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
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      'music:musician': artist.name,
      'music:album': artist.tagline || 'Latest Music',
      ...(artist.is_verified && { 'music:verified': 'true' }),
    },
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  const supabase = await createServerClient();

  const { data: artists } = await supabase
    .from('artists')
    .select('handle')
    .eq('published', true);

  return (
    artists?.map((artist) => ({
      handle: artist.handle,
    })) || []
  );
}

// Generate structured data for better SEO
function generateStructuredData(artist: Artist, socialLinks: SocialLink[]) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${APP_URL}/${artist.handle}`,
    name: artist.name,
    alternateName: artist.handle,
    description: artist.tagline || `Music artist ${artist.name}`,
    url: `${APP_URL}/${artist.handle}`,
    image: artist.image_url
      ? {
          '@type': 'ImageObject',
          url: artist.image_url,
          width: 400,
          height: 400,
        }
      : undefined,
    sameAs: socialLinks
      .filter((link) =>
        ['instagram', 'twitter', 'facebook', 'youtube', 'tiktok'].includes(
          link.platform.toLowerCase()
        )
      )
      .map((link) => link.url),
    jobTitle: 'Music Artist',
    worksFor: {
      '@type': 'Organization',
      name: 'Music Industry',
    },
    knowsAbout: ['Music', 'Art', 'Entertainment'],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Music Artist',
      occupationLocation: {
        '@type': 'Place',
        name: 'Global',
      },
    },
    // Add verification status
    ...(artist.is_verified && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'verified',
        value: true,
      },
    }),
  };

  return structuredData;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const supabase = await createServerClient();

  // Fetch artist and social links in a single query to reduce latency
  const { data, error } = await supabase
    .from('artists')
    .select('*, social_links(*)')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (error || !data) {
    notFound();
  }

  const { social_links: socialLinks = [], ...artist } = data as Artist & {
    social_links: SocialLink[];
  };

  // Generate structured data
  const structuredData = generateStructuredData(artist, socialLinks);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ArtistSEO artist={artist} socialLinks={socialLinks} />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Container>
          <div className="flex min-h-screen flex-col py-12">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-md space-y-8">
                <ProfileHeader artist={artist} />

                <div className="flex justify-center">
                  <ListenNow handle={artist.handle} artistName={artist.name} />
                </div>

                <SocialBar
                  handle={artist.handle}
                  artistName={artist.name}
                  socialLinks={socialLinks}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ProfileFooter artist={artist} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
