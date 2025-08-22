-- =====================================
-- PERFORMANCE OPTIMIZATION MIGRATION
-- =====================================
-- This migration adds specific indexes and optimizations for sub-100ms profile loading
-- Target: Profile pages with joined social links data

-- Add composite indexes for profile + social links queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS creator_profiles_username_public_perf_idx 
ON creator_profiles (username_normalized, is_public) 
WHERE is_public = true;

-- Optimized index for social links joining with creator profiles
CREATE INDEX CONCURRENTLY IF NOT EXISTS social_links_creator_active_perf_idx
ON social_links (creator_profile_id, is_active, sort_order)
WHERE is_active = true;

-- Composite index for profile metadata queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS creator_profiles_metadata_perf_idx
ON creator_profiles (id, username, display_name, bio, avatar_url, is_public, is_verified, is_featured)
WHERE is_public = true;

-- Optimized view for profile data with pre-joined social links
CREATE OR REPLACE VIEW profile_with_social_links AS
SELECT 
  cp.id,
  cp.user_id,
  cp.creator_type,
  cp.username,
  cp.display_name,
  cp.bio,
  cp.avatar_url,
  cp.spotify_url,
  cp.apple_music_url,
  cp.youtube_url,
  cp.spotify_id,
  cp.is_public,
  cp.is_verified,
  cp.is_featured,
  cp.marketing_opt_out,
  cp.is_claimed,
  cp.claim_token,
  cp.claimed_at,
  cp.last_login_at,
  cp.profile_views,
  cp.onboarding_completed_at,
  cp.username_normalized,
  cp.search_text,
  cp.display_title,
  cp.profile_completion_pct,
  cp.created_by,
  cp.updated_by,
  cp.settings,
  cp.theme,
  cp.created_at,
  cp.updated_at,
  -- Aggregated social links as JSON
  COALESCE(
    json_agg(
      json_build_object(
        'id', sl.id,
        'platform', sl.platform,
        'platform_type', sl.platform_type,
        'url', sl.url,
        'display_text', sl.display_text,
        'sort_order', sl.sort_order,
        'clicks', sl.clicks
      ) ORDER BY sl.sort_order, sl.created_at
    ) FILTER (WHERE sl.id IS NOT NULL),
    '[]'::json
  ) as social_links
FROM creator_profiles cp
LEFT JOIN social_links sl ON (
  cp.id = sl.creator_profile_id 
  AND sl.is_active = true
)
WHERE cp.is_public = true
GROUP BY cp.id;

-- Grant permissions on the view
GRANT SELECT ON profile_with_social_links TO anon;
GRANT SELECT ON profile_with_social_links TO authenticated;

-- Create function for fast profile lookup with social links
CREATE OR REPLACE FUNCTION get_profile_with_social_links(username_param text)
RETURNS TABLE(
  id uuid,
  user_id text,
  creator_type text,
  username text,
  display_name text,
  bio text,
  avatar_url text,
  spotify_url text,
  apple_music_url text,
  youtube_url text,
  spotify_id text,
  is_public boolean,
  is_verified boolean,
  is_featured boolean,
  marketing_opt_out boolean,
  is_claimed boolean,
  claim_token text,
  claimed_at timestamptz,
  last_login_at timestamptz,
  profile_views integer,
  onboarding_completed_at timestamptz,
  username_normalized text,
  search_text text,
  display_title text,
  profile_completion_pct integer,
  created_by text,
  updated_by text,
  settings jsonb,
  theme jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  social_links json
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM profile_with_social_links 
  WHERE username_normalized = lower(username_param)
  LIMIT 1;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_profile_with_social_links(text) TO anon;
GRANT EXECUTE ON FUNCTION get_profile_with_social_links(text) TO authenticated;

-- Update table statistics to ensure query planner uses new indexes
ANALYZE creator_profiles;
ANALYZE social_links;

-- Add comment for documentation
COMMENT ON FUNCTION get_profile_with_social_links(text) IS 'Optimized function to fetch profile with social links in a single query for sub-100ms performance';
COMMENT ON VIEW profile_with_social_links IS 'Optimized view combining creator profiles with their social links for fast profile page loading';