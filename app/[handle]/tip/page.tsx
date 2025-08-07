import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { Artist, SocialLink } from '@/types/db';
import { Container } from '@/components/site/Container';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TipJar } from '@/components/profile/TipJar';
import { SocialBar } from '@/components/organisms/SocialBar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { ArtistSEO } from '@/components/seo/ArtistSEO';
import { ThemeToggle } from '@/components/site/ThemeToggle';

interface ProfilePageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const supabase = await createServerClient();

  if (!supabase) {
    return {
      title: 'Artist Not Found',
    };
  }

  const { data: artist } = await supabase
    .from('artists')
    .select('name, tagline, image_url, is_verified')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (!artist) {
    return {
      title: 'Artist Not Found',
    };
  }

  const title = `${artist.name} - Music Artist`;
  const description =
    artist.tagline ||
    `Listen to ${artist.name} on Spotify and other platforms.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: artist.image_url
        ? [
            {
              url: artist.image_url,
              width: 400,
              height: 400,
              alt: `${artist.name} - Music Artist Profile Photo`,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: artist.image_url ? [artist.image_url] : [],
    },
    other: {
      'profile:username': handle,
      ...(artist.is_verified && { 'profile:verified': 'true' }),
    },
  };
}

export async function generateStaticParams() {
  const supabase = await createServerClient();

  if (!supabase) {
    return [];
  }

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

function generateStructuredData(artist: Artist, socialLinks: SocialLink[]) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    url: `https://jovie.co/${artist.handle}`,
    image: artist.image_url,
    description: artist.tagline,
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
    // Add social media links
    sameAs: socialLinks.map((link) => link.url),
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

  if (!supabase) {
    notFound();
  }

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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Container>
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>

          <div className="flex min-h-screen flex-col py-12">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-md space-y-8">
                <ProfileHeader artist={artist} />

                <div className="flex justify-center">
                  <TipJar handle={artist.handle} artistName={artist.name} />
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
