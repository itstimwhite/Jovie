import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { Artist, SocialLink } from '@/types/db';
import { ListenNow } from '@/components/profile/ListenNow';
import { ArtistSEO } from '@/components/seo/ArtistSEO';
import { DesktopQrOverlay } from '@/components/profile/DesktopQrOverlay';
import { ArtistPageShell } from '@/components/profile/ArtistPageShell';
import { PAGE_SUBTITLES } from '@/constants/app';

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
        <ArtistPageShell
          artist={artist}
          socialLinks={socialLinks}
          subtitle={PAGE_SUBTITLES.profile}
        >
          <div className="flex justify-center">
            <ListenNow handle={artist.handle} artistName={artist.name} />
          </div>
        </ArtistPageShell>
        <DesktopQrOverlay handle={artist.handle} />
      </>
    );
  } catch (error) {
    console.error('Unexpected error in ProfilePage:', error);
    notFound();
  }
}
