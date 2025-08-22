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
import { env } from '@/lib/env';
import { getPopularProfiles } from '@/lib/profiles/popular';
import { cache as redisCache } from '@/lib/cache';
import { CacheMonitoring } from '@/lib/monitoring/cache';

// Create an anonymous Supabase client for public data
function createAnonSupabase() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || // New standard key
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Fallback to deprecated key

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Using CreatorProfile type and convertCreatorProfileToArtist utility from types/db.ts

// Cache the database query to prevent duplicate calls during page + metadata generation
const getCreatorProfile = cache(
  async (username: string): Promise<CreatorProfile | null> => {
    // Try to get from Redis cache first
    if (redisCache.isEnabled()) {
      const cachedProfile = await redisCache.profile.get(username);
      if (cachedProfile) {
        // Track cache hit for monitoring
        await CacheMonitoring.trackCacheHit('redis', `profile:${username}`);
        return cachedProfile;
      }
      // Track cache miss for monitoring
      await CacheMonitoring.trackCacheMiss('redis', `profile:${username}`);
    }

    // If not in cache or cache is disabled, fetch from database
    const supabase = createAnonSupabase();

    // Try to use the materialized view for better performance
    try {
      const { data, error } = await supabase
        .from('profile_summary')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (!error && data) {
        // Cache the result in Redis if enabled
        if (redisCache.isEnabled()) {
          await redisCache.profile.set(username, data);
        }
        return data as CreatorProfile;
      }
    } catch (e) {
      // Fallback to regular table if materialized view query fails
      console.error('Error querying profile_summary view:', e);
    }

    // Fallback to regular table query
    const { data, error } = await supabase
      .from('creator_profiles')
      .select(
        'id, user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, apple_music_url, youtube_url, spotify_id, is_public, is_verified, is_claimed, claim_token, claimed_at, settings, theme, created_at, updated_at'
      )
      .eq('username', username.toLowerCase())
      .eq('is_public', true) // Only fetch public profiles
      .single();

    if (error || !data) {
      return null;
    }

    // Add default values for fields that might not exist in the database yet
    const d = data as Partial<CreatorProfile>;
    const profile = {
      ...data,
      is_featured: d.is_featured ?? false,
      marketing_opt_out: d.marketing_opt_out ?? false,
    } as CreatorProfile;

    // Cache the result in Redis if enabled
    if (redisCache.isEnabled()) {
      await redisCache.profile.set(username, profile);
    }

    return profile;
  }
);

// Cache function for social links - could be from database in future
const getSocialLinks = cache(
  async (profile: CreatorProfile): Promise<LegacySocialLink[]> => {
    // Try to get from Redis cache first
    if (redisCache.isEnabled()) {
      const cachedLinks = await redisCache.socialLinks.get(profile.id);
      if (cachedLinks) {
        // Track cache hit for monitoring
        await CacheMonitoring.trackCacheHit(
          'redis',
          `social_links:${profile.id}`
        );
        return cachedLinks;
      }
      // Track cache miss for monitoring
      await CacheMonitoring.trackCacheMiss(
        'redis',
        `social_links:${profile.id}`
      );
    }

    // If not in cache or cache is disabled, fetch from database
    const supabase = createAnonSupabase();

    try {
      // Try to fetch from the database first
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('creator_profile_id', profile.id);

      if (!error && data && data.length > 0) {
        // Cache the result in Redis if enabled
        if (redisCache.isEnabled()) {
          await redisCache.socialLinks.set(profile.id, data);
        }
        return data;
      }
    } catch (e) {
      console.error('Error fetching social links:', e);
    }

    // Fallback to hardcoded links if database query fails or returns no results
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

    // Cache the hardcoded links in Redis if enabled
    if (redisCache.isEnabled()) {
      await redisCache.socialLinks.set(profile.id, socialLinks);
    }

    return socialLinks;
  }
);

interface Props {
  params: {
    username: string;
  };
  searchParams?: {
    mode?: 'profile' | 'listen' | 'tip';
  };
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  const { mode = 'profile' } = resolvedSearchParams || {};

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
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
    };
  }

  const title = `${profile.display_name || profile.username} - Artist Profile`;
  const description = profile.bio
    ? `${profile.bio.slice(0, 160)}${profile.bio.length > 160 ? '...' : ''}`
    : `Check out ${profile.display_name || profile.username}'s artist profile on Jovie.`;

  return {
    title,
    description,
    // OpenGraph with optimized image
    openGraph: {
      title,
      description,
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 400,
              height: 400,
              alt: `${profile.display_name || profile.username} profile picture`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

// Pre-generate popular profiles at build time
export async function generateStaticParams() {
  return await getPopularProfiles();
}

// Enable ISR with 30 minute revalidation for app-level caching
export const revalidate = 1800;

// Enable edge runtime for better performance
export const runtime = 'edge';

// Set shorter edge cache TTL (5 minutes) for fresher content at the edge
// This works with the Cache-Control headers in next.config.js
export const fetchCache = 'force-cache';
