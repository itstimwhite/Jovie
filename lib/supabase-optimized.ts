import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { env } from '@/lib/env';
import {
  CreatorProfile,
  SocialLink,
  LegacySocialLink,
  convertCreatorProfileToArtist,
  Artist,
} from '@/types/db';

// Performance monitoring
const ENABLE_PERFORMANCE_LOGS = process.env.NODE_ENV === 'development';

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

// Interface for combined profile and social links data
export interface ProfileWithSocialLinks {
  profile: CreatorProfile;
  socialLinks: SocialLink[];
  artist: Artist; // Converted artist for backwards compatibility
}

// Optimized query to fetch profile and social links in a single database call
export const getProfileWithSocialLinks = cache(
  async (username: string): Promise<ProfileWithSocialLinks | null> => {
    const startTime = ENABLE_PERFORMANCE_LOGS ? performance.now() : 0;
    const supabase = createAnonSupabase();

    try {
      // First, get the profile by username
      const { data: profile, error: profileError } = await supabase
        .from('creator_profiles')
        .select(
          'id, user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, apple_music_url, youtube_url, spotify_id, is_public, is_verified, is_claimed, claim_token, claimed_at, settings, theme, created_at, updated_at, is_featured, marketing_opt_out'
        )
        .eq('username_normalized', username.toLowerCase())
        .eq('is_public', true)
        .single();

      if (profileError || !profile) {
        return null;
      }

      // Then, get social links in the same transaction
      const { data: socialLinks, error: linksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('creator_profile_id', profile.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (linksError) {
        console.error('Error fetching social links:', linksError);
        // Continue with empty social links rather than failing completely
      }

      // Convert to Artist type for backwards compatibility
      const artist = convertCreatorProfileToArtist(profile as CreatorProfile);

      // Log performance metrics in development
      if (ENABLE_PERFORMANCE_LOGS) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(
          `[Performance] Profile query for ${username} took ${duration.toFixed(2)}ms`
        );

        if (duration > 100) {
          console.warn(
            `[Performance Warning] Profile query exceeded 100ms target: ${duration.toFixed(2)}ms`
          );
        }
      }

      return {
        profile: profile as CreatorProfile,
        socialLinks: socialLinks || [],
        artist,
      };
    } catch (error) {
      console.error('Error in getProfileWithSocialLinks:', error);
      return null;
    }
  }
);

// Function to convert modern SocialLink to legacy format for backwards compatibility
export function convertToLegacySocialLinks(
  socialLinks: SocialLink[]
): LegacySocialLink[] {
  return socialLinks.map((link) => ({
    id: link.id,
    artist_id: link.creator_profile_id,
    platform: link.platform,
    url: link.url,
    clicks: link.clicks,
    created_at: link.created_at,
  }));
}

// Optimized query to fetch only profile data (for metadata generation)
export const getProfileForMetadata = cache(
  async (username: string): Promise<CreatorProfile | null> => {
    const startTime = ENABLE_PERFORMANCE_LOGS ? performance.now() : 0;
    const supabase = createAnonSupabase();

    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('id, username, display_name, bio, avatar_url, is_public')
        .eq('username_normalized', username.toLowerCase())
        .eq('is_public', true)
        .single();

      if (error || !data) {
        return null;
      }

      // Log performance metrics in development
      if (ENABLE_PERFORMANCE_LOGS) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(
          `[Performance] Metadata query for ${username} took ${duration.toFixed(2)}ms`
        );
      }

      return data as CreatorProfile;
    } catch (error) {
      console.error('Error in getProfileForMetadata:', error);
      return null;
    }
  }
);
