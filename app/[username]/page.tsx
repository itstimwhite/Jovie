import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { AnimatedArtistPage } from '@/components/profile/AnimatedArtistPage';
import { DesktopQrOverlay } from '@/components/profile/DesktopQrOverlay';
import {
  LegacySocialLink,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';
import { PAGE_SUBTITLES } from '@/constants/app';

// Create an anonymous Supabase client for public data
function createAnonSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

// Using CreatorProfile type and convertCreatorProfileToArtist utility from types/db.ts

async function getCreatorProfile(
  username: string
): Promise<CreatorProfile | null> {
  const supabase = createAnonSupabase();

  console.log(
    '[getCreatorProfile] Looking for username:',
    username.toLowerCase()
  );

  const { data, error } = await supabase
    .from('creator_profiles')
    .select(
      'id, user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, apple_music_url, youtube_url, spotify_id, is_public, is_verified, settings, theme, created_at, updated_at'
    )
    .eq('username', username.toLowerCase())
    .eq('is_public', true) // Only fetch public profiles
    .single();

  console.log('[getCreatorProfile] Query result:', { data, error });

  if (error || !data) {
    console.log('[getCreatorProfile] No data found or error occurred');
    return null;
  }

  console.log('[getCreatorProfile] Found profile:', data);
  return data;
}

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
  const profile = await getCreatorProfile(username);

  if (!profile) {
    notFound();
  }

  // Convert our profile data to the Artist type expected by components
  const artist = convertCreatorProfileToArtist(profile);

  // Mock social links for testing (in a real app, these would come from the database)
  const socialLinks: LegacySocialLink[] =
    profile.username === 'ladygaga'
      ? [
          {
            id: 'venmo-link-1',
            artist_id: artist.id,
            platform: 'venmo',
            url: 'https://venmo.com/u/ladygaga',
            clicks: 0,
            created_at: new Date().toISOString(),
          },
          {
            id: 'spotify-link-1',
            artist_id: artist.id,
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
              artist_id: artist.id,
              platform: 'venmo',
              url: 'https://venmo.com/u/timwhite',
              clicks: 0,
              created_at: new Date().toISOString(),
            },
          ]
        : [];

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
      <AnimatedArtistPage
        mode={mode}
        artist={artist}
        socialLinks={socialLinks}
        subtitle={getSubtitle(mode)}
        showTipButton={showTipButton}
        showBackButton={showBackButton}
      />
      <DesktopQrOverlay handle={artist.handle} />
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
