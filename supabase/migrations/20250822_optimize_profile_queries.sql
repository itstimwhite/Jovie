-- Migration to optimize database queries for profile loading
-- This adds additional indexes to improve query performance

-- Ensure username_normalized index exists and is optimized for equality searches
DROP INDEX IF EXISTS creator_profiles_username_normalized_idx;
CREATE INDEX IF NOT EXISTS creator_profiles_username_normalized_idx 
ON creator_profiles(username_normalized, is_public)
WHERE is_public = true;

-- Ensure social_links has proper indexes for quick lookups by creator_profile_id
DROP INDEX IF EXISTS social_links_creator_profile_id_active_idx;
CREATE INDEX IF NOT EXISTS social_links_creator_profile_id_active_idx 
ON social_links(creator_profile_id, is_active, sort_order)
WHERE is_active = true;

-- Add index for venmo links specifically since they're used for tip button visibility
DROP INDEX IF EXISTS social_links_venmo_idx;
CREATE INDEX IF NOT EXISTS social_links_venmo_idx 
ON social_links(creator_profile_id, platform)
WHERE platform = 'venmo' AND is_active = true;

-- Analyze tables to update statistics for query planner
ANALYZE creator_profiles;
ANALYZE social_links;

