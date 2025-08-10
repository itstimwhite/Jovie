import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { Artist, SocialLink } from '@/types/db';
import { Container } from '@/components/site/Container';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ListenNow } from '@/components/profile/ListenNow';
import { SocialBar } from '@/components/organisms/SocialBar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { ArtistSEO } from '@/components/seo/ArtistSEO';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { DesktopQrOverlay } from '@/components/profile/DesktopQrOverlay';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  try {
    const supabase = await createServerClient();

    if (!supabase) {
      return {
        title: 'Artist Not Found - Jovie',
        description: 'The requested artist profile could not be found.',
      };
    }

    const { data: artist, error } = await supabase
      .from('artists')
      .select('name, tagline, image_url, is_verified')
      .eq('handle', handle)
      .eq('published', true)
      .single();

    if (error || !artist) {
      return {
        title: 'Artist Not Found - Jovie',
        description: 'The requested artist profile could not be found.',
      };
    }

    const title = `${artist.name} - Music Artist | Jovie`;
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Artist Profile - Jovie',
      description: 'Discover and listen to music artists on Jovie.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createServerClient();

    if (!supabase) {
      console.warn('Supabase not available for static params generation');
      return [];
    }

    const { data: artists, error } = await supabase
      .from('artists')
      .select('handle')
      .eq('published', true);

    if (error) {
      console.error('Error fetching artists for static params:', error);
      return [];
    }

    return (
      artists?.map((artist) => ({
        handle: artist.handle,
      })) || []
    );
  } catch (error) {
    console.error('Unexpected error in generateStaticParams:', error);
    return [];
  }
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

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  try {
    const supabase = await createServerClient();

    if (!supabase) {
      console.error('Supabase client not available');
      notFound();
    }

    // Fetch artist and social links in a single query to reduce latency
    const { data, error } = await supabase
      .from('artists')
      .select('*, social_links(*)')
      .eq('handle', handle)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching artist:', error);
      notFound();
    }

    if (!data) {
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
                    <ListenNow
                      handle={artist.handle}
                      artistName={artist.name}
                    />
                  </div>

                  <SocialBar
                    handle={artist.handle}
                    artistName={artist.name}
                    socialLinks={socialLinks}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ProfileFooter
                  artistHandle={artist.handle}
                  artistSettings={artist.settings}
                />
              </div>
            </div>
          </Container>
          <DesktopQrOverlay handle={artist.handle} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Unexpected error in ProfilePage:', error);
    notFound();
  }
}
