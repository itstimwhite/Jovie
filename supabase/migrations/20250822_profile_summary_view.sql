-- Create materialized view for frequently accessed profile data
-- This reduces database load for common profile queries

-- Create the materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.profile_summary AS
SELECT 
  cp.id,
  cp.user_id,
  cp.username,
  cp.display_name,
  cp.bio,
  cp.avatar_url,
  cp.is_verified,
  cp.is_featured,
  cp.creator_type,
  cp.spotify_url,
  cp.apple_music_url,
  cp.youtube_url,
  cp.spotify_id,
  cp.created_at,
  COUNT(sl.id) as social_link_count
FROM creator_profiles cp
LEFT JOIN social_links sl ON cp.id = sl.creator_profile_id
WHERE cp.is_public = true
GROUP BY cp.id;

-- Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS idx_profile_summary_username ON public.profile_summary (username);

-- Create index on is_featured for popular profiles
CREATE INDEX IF NOT EXISTS idx_profile_summary_featured ON public.profile_summary (is_featured) WHERE is_featured = true;

-- Grant appropriate permissions
GRANT SELECT ON public.profile_summary TO anon, authenticated, service_role;

-- Add RLS policy for the materialized view
ALTER MATERIALIZED VIEW public.profile_summary ENABLE ROW LEVEL SECURITY;

-- Public profiles are visible to everyone
CREATE POLICY "Public profiles are visible to everyone" 
  ON public.profile_summary
  FOR SELECT
  USING (true);

