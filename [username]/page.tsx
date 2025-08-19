import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Suspense } from 'react';
import { ProgressiveArtistPage } from '@/components/profile/ProgressiveArtistPage';
import { DesktopQrOverlay } from '@/components/profile/DesktopQrOverlay';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import {
  LegacySocialLink,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';
import { PAGE_SUBTITLES } from '@/constants/app';

// Create an anonymous Supabase client for public data
function createAnonSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

// Using CreatorProfile type and convertCreatorProfileToArtist utility from types/db.ts

// Cache the database query to prevent duplicate calls during page + metadata generation
const getCreatorProfile = cache(
  async (username: string): Promise<CreatorProfile | null> => {
    const supabase = createAnonSupabase();

    const { data, error } = await supabase
      .from('creator_profiles')
      .select(
        'id, user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, apple_music_url, youtube_url, spotify_id, is_public, is_verified, settings, theme, created_at, updated_at'
      )
      .eq('username', username.toLowerCase())
      .eq('is_public', true) // Only fetch public profiles
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }
);

// Cache function for social links - could be from database in future
const getSocialLinks = cache(
  async (profile: CreatorProfile): Promise<LegacySocialLink[]> => {
    // For now, return hardcoded links but this could be a parallel DB query
    // TODO: Replace with actual social_links table query when available
    const socialLinks: LegacySocialLink[] =
      profile.username === 'ladygaga'
        ? [
            {
              id: 'venmo-link-1',
              artist_id: profile.id,
              platform: 'venmo',
              url: 'https://venmo.com/u/ladygaga',
              clicks: 0,
              created_at: new Date().toISOString(),
            },
            {
              id: 'spotify-link-1',
              artist_id: profile.id,
              platform: 'spotify',
              url: 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms',
              clicks: 0,
              created_at: new Date().toISOString(),
            },
          ]
        : profile.username === 'tim'
          ? [
              {
                id: 'venmo-link-2',
                artist_id: profile.id,
                platform: 'venmo',
                url: 'https://venmo.com/u/timwhite',
                clicks: 0,
                created_at: new Date().toISOString(),
              },
            ]
          : [];

    return socialLinks;
  }
);

interface Props {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    mode?: 'profile' | 'listen' | 'tip';
  }>;
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const { username } = await params;
  const { mode = 'profile' } = await searchParams;

  // Parallel data fetching - profile first, then social links
  const profile = await getCreatorProfile(username);

  if (!profile) {
    notFound();
  }

  // Convert our profile data to the Artist type expected by components
  const artist = convertCreatorProfileToArtist(profile);

  // Fetch social links in parallel (when this becomes a DB query)
  const socialLinks = await getSocialLinks(profile);

  // Determine subtitle based on mode
  const getSubtitle = (mode: string) => {
    switch (mode) {
      case 'listen':
        return PAGE_SUBTITLES.listen;
      case 'tip':
        return PAGE_SUBTITLES.tip;
      default:
        return PAGE_SUBTITLES.profile;
    }
  };

  // Show tip button when not in tip mode and artist has venmo
  const hasVenmoLink = socialLinks.some((link) => link.platform === 'venmo');
  const showTipButton = mode !== 'tip' && hasVenmoLink;
  const showBackButton = mode !== 'profile';

  return (
    <>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProgressiveArtistPage
          mode={mode}
          artist={artist}
          socialLinks={socialLinks}
          subtitle={getSubtitle(mode)}
          showTipButton={showTipButton}
          showBackButton={showBackButton}
        />
      </Suspense>
      <Suspense fallback={null}>
        <DesktopQrOverlay handle={artist.handle} />
      </Suspense>
    </>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const profile = await getCreatorProfile(username);

  if (!profile) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist profile could not be found.',
    };
  }

  return {
    title: `${profile.display_name || profile.username} - Artist Profile`,
    description: profile.bio
      ? `${profile.bio.slice(0, 160)}${profile.bio.length > 160 ? '...' : ''}`
      : `Check out ${profile.display_name || profile.username}'s artist profile on Jovie.`,
  };
}

// Generate static params for popular/known profiles
export async function generateStaticParams() {
  // Pre-generate pages for known popular profiles
  // This can be expanded to query the database for most popular profiles
  const popularProfiles = ['ladygaga', 'tim', 'testartist1', 'publicartist'];

  return popularProfiles.map((username) => ({
    username,
  }));
}

// Enable ISR with 1 hour revalidation for public profiles
export const revalidate = 3600;

// Temporarily disable edge runtime for debugging
// export const runtime = 'edge';
