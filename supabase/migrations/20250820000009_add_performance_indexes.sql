-- Critical performance indexes for onboarding and profile flows
-- Migration: 20250820000009_add_performance_indexes

-- Ensure unique constraint on username (critical for handle validation)
CREATE UNIQUE INDEX IF NOT EXISTS creator_profiles_username_unique_idx 
ON creator_profiles(lower(username));

-- Index for user lookups in dashboard
CREATE INDEX IF NOT EXISTS creator_profiles_user_id_idx 
ON creator_profiles(user_id);

-- Partial index for public profile lookups (app/[username]/page.tsx)
CREATE INDEX IF NOT EXISTS creator_profiles_public_username_idx 
ON creator_profiles(lower(username)) 
WHERE is_public = true;

-- Index for verification status (featured artists, etc.)
CREATE INDEX IF NOT EXISTS creator_profiles_verified_idx 
ON creator_profiles(is_verified) 
WHERE is_verified = true;

-- Composite index for dashboard queries
CREATE INDEX IF NOT EXISTS creator_profiles_user_public_idx 
ON creator_profiles(user_id, is_public);

-- Index for app_users table
CREATE INDEX IF NOT EXISTS app_users_id_idx 
ON app_users(id);

-- Comment for documentation
COMMENT ON INDEX creator_profiles_username_unique_idx IS 'Ensures username uniqueness and enables fast handle validation lookups';
COMMENT ON INDEX creator_profiles_public_username_idx IS 'Optimizes public profile lookups by username (app/[username]/page.tsx)';
COMMENT ON INDEX creator_profiles_user_id_idx IS 'Optimizes dashboard profile lookups by user_id';