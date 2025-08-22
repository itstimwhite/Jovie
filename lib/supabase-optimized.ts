import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';
import { CreatorProfile, LegacySocialLink } from '@/types/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cache the token fetching to avoid redundant calls
const getCachedToken = cache(async () => {
  try {
    const { getToken } = await auth();
    return await getToken();
  } catch {
    return null;
  }
});

// Optimized server client with connection pooling and caching
export async function createOptimizedServerClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are required');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'jovie-optimized',
      },
    },
    async accessToken() {
      return (await getCachedToken()) ?? null;
    },
  });
}

// Batch query helper for reducing database round trips
export async function batchQuery<T>(
  queries: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(queries.map((q) => q()));
}

// Query with automatic retry on transient failures
export async function queryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 2
): Promise<{ data: T | null; error: any }> {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    const result = await queryFn();

    if (!result.error) {
      return result;
    }

    // Only retry on transient errors
    if (
      result.error?.code === 'PGRST301' || // JWT expired
      result.error?.code === '503' || // Service unavailable
      result.error?.message?.includes('fetch')
    ) {
      lastError = result.error;
      if (i < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 100)
        );
        continue;
      }
    }

    return result;
  }

  return { data: null, error: lastError };
}

// Type for the optimized profile response
interface OptimizedProfileResponse {
  id: string;
  user_id: string | null;
  creator_type: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  youtube_url: string | null;
  spotify_id: string | null;
  is_public: boolean;
  is_verified: boolean;
  is_featured: boolean;
  marketing_opt_out: boolean;
  is_claimed: boolean;
  claim_token: string | null;
  claimed_at: string | null;
  last_login_at: string | null;
  profile_views: number;
  onboarding_completed_at: string | null;
  username_normalized: string;
  search_text: string;
  display_title: string;
  profile_completion_pct: number;
  created_by: string | null;
  updated_by: string | null;
  settings: Record<string, unknown> | null;
  theme: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  social_links: Array<{
    id: string;
    platform: string;
    platform_type: string;
    url: string;
    display_text?: string;
    sort_order: number;
    clicks: number;
  }>;
}

// Optimized function to get profile with social links in a single query
export const getOptimizedProfileWithSocialLinks = cache(
  async (username: string): Promise<{
    profile: CreatorProfile | null;
    socialLinks: LegacySocialLink[];
  }> => {
    const supabase = await createOptimizedServerClient();
    
    const result = await queryWithRetry(async () => {
      return supabase.rpc('get_profile_with_social_links', {
        username_param: username.toLowerCase()
      }).single();
    });

    if (result.error || !result.data) {
      return { profile: null, socialLinks: [] };
    }

    const data = result.data as OptimizedProfileResponse;
    
    // Convert to expected types
    const profile: CreatorProfile = {
      id: data.id,
      user_id: data.user_id,
      creator_type: data.creator_type as any,
      username: data.username,
      display_name: data.display_name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      spotify_url: data.spotify_url,
      apple_music_url: data.apple_music_url,
      youtube_url: data.youtube_url,
      spotify_id: data.spotify_id,
      is_public: data.is_public,
      is_verified: data.is_verified,
      is_featured: data.is_featured,
      marketing_opt_out: data.marketing_opt_out,
      is_claimed: data.is_claimed,
      claim_token: data.claim_token,
      claimed_at: data.claimed_at,
      last_login_at: data.last_login_at,
      profile_views: data.profile_views,
      onboarding_completed_at: data.onboarding_completed_at,
      username_normalized: data.username_normalized,
      search_text: data.search_text,
      display_title: data.display_title,
      profile_completion_pct: data.profile_completion_pct,
      created_by: data.created_by,
      updated_by: data.updated_by,
      settings: data.settings,
      theme: data.theme,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    // Convert social links to legacy format for backward compatibility
    const socialLinks: LegacySocialLink[] = data.social_links.map(link => ({
      id: link.id,
      artist_id: data.id, // Map to artist_id for backwards compatibility
      platform: link.platform,
      url: link.url,
      clicks: link.clicks,
      created_at: new Date().toISOString(), // Social links don't have created_at in the view
    }));

    return { profile, socialLinks };
  }
);

// Cache for anonymous client
const anonymousClientCache = cache(async () => {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'jovie-optimized-anon',
      },
    },
  });
});

// Optimized function for anonymous queries (no authentication)
export const getOptimizedProfileWithSocialLinksAnonymous = cache(
  async (username: string): Promise<{
    profile: CreatorProfile | null;
    socialLinks: LegacySocialLink[];
  }> => {
    const supabase = await anonymousClientCache();
    
    const result = await queryWithRetry(async () => {
      return supabase.rpc('get_profile_with_social_links', {
        username_param: username.toLowerCase()
      }).single();
    });

    if (result.error || !result.data) {
      return { profile: null, socialLinks: [] };
    }

    const data = result.data as OptimizedProfileResponse;
    
    // Convert to expected types
    const profile: CreatorProfile = {
      id: data.id,
      user_id: data.user_id,
      creator_type: data.creator_type as any,
      username: data.username,
      display_name: data.display_name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      spotify_url: data.spotify_url,
      apple_music_url: data.apple_music_url,
      youtube_url: data.youtube_url,
      spotify_id: data.spotify_id,
      is_public: data.is_public,
      is_verified: data.is_verified,
      is_featured: data.is_featured,
      marketing_opt_out: data.marketing_opt_out,
      is_claimed: data.is_claimed,
      claim_token: data.claim_token,
      claimed_at: data.claimed_at,
      last_login_at: data.last_login_at,
      profile_views: data.profile_views,
      onboarding_completed_at: data.onboarding_completed_at,
      username_normalized: data.username_normalized,
      search_text: data.search_text,
      display_title: data.display_title,
      profile_completion_pct: data.profile_completion_pct,
      created_by: data.created_by,
      updated_by: data.updated_by,
      settings: data.settings,
      theme: data.theme,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    // Convert social links to legacy format for backward compatibility
    const socialLinks: LegacySocialLink[] = data.social_links.map(link => ({
      id: link.id,
      artist_id: data.id, // Map to artist_id for backwards compatibility
      platform: link.platform,
      url: link.url,
      clicks: link.clicks,
      created_at: new Date().toISOString(), // Social links don't have created_at in the view
    }));

    return { profile, socialLinks };
  }
);
