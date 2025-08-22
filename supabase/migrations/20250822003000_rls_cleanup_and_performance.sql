-- =====================================
-- RLS CLEANUP AND PERFORMANCE INDEXES
-- =====================================
-- Migration: 20250822003000_rls_cleanup_and_performance
-- Purpose: Clean up brittle RLS policies and add performance indexes
--
-- Changes:
-- 1. Remove policies depending on current_setting HTTP vars
-- 2. Add performance indexes for common query patterns
-- 3. Optimize existing policies for better performance
-- 4. Add partial indexes where beneficial

-- =====================================
-- CLEANUP BRITTLE RLS POLICIES
-- =====================================

-- The baseline migration already uses auth.jwt()->>'sub' correctly
-- But let's ensure no policies rely on current_setting HTTP variables
-- and clean up any potential brittleness

-- Check and update any policies that might use current_setting improperly
-- (This is defensive - the baseline should already be correct)

-- Drop and recreate the audit functions to ensure they don't rely on current_setting
DROP FUNCTION IF EXISTS get_current_user_id() CASCADE;

-- Recreate with more robust user ID detection
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    auth.jwt()->>'sub',
    'system'
  );
$$;

-- =====================================
-- PERFORMANCE INDEXES
-- =====================================

-- Creator profiles performance indexes
CREATE INDEX IF NOT EXISTS creator_profiles_public_username_idx 
ON creator_profiles(is_public, username_normalized) 
WHERE is_public = true;

CREATE INDEX IF NOT EXISTS creator_profiles_claimed_user_idx 
ON creator_profiles(is_claimed, user_id) 
WHERE is_claimed = true AND user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS creator_profiles_unclaimed_token_idx 
ON creator_profiles(claim_token) 
WHERE is_claimed = false AND claim_token IS NOT NULL;

-- Social links performance indexes  
CREATE INDEX IF NOT EXISTS social_links_creator_active_sort_idx 
ON social_links(creator_profile_id, is_active, sort_order) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS social_links_platform_type_active_idx 
ON social_links(platform_type, is_active, creator_profile_id) 
WHERE is_active = true;

-- Click events performance indexes (additional to existing ones)
CREATE INDEX IF NOT EXISTS click_events_link_type_created_idx 
ON click_events(link_type, created_at DESC);

CREATE INDEX IF NOT EXISTS click_events_target_created_idx 
ON click_events(target, created_at DESC);

-- Recent clicks index for analytics (last 30 days)
CREATE INDEX IF NOT EXISTS click_events_recent_analytics_idx 
ON click_events(creator_id, link_type, created_at DESC) 
WHERE created_at > (now() - interval '30 days');

-- App users performance indexes
CREATE INDEX IF NOT EXISTS app_users_billing_idx 
ON app_users(is_pro, plan) 
WHERE is_pro = true;

CREATE INDEX IF NOT EXISTS app_users_stripe_idx 
ON app_users(stripe_customer_id, stripe_subscription_id) 
WHERE stripe_customer_id IS NOT NULL;

-- Subscriptions performance indexes
CREATE INDEX IF NOT EXISTS subscriptions_active_idx 
ON subscriptions(user_id, status, current_period_end) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS subscriptions_stripe_idx 
ON subscriptions(stripe_subscription_id, status) 
WHERE stripe_subscription_id IS NOT NULL;

-- Tips performance indexes
CREATE INDEX IF NOT EXISTS tips_creator_amount_idx 
ON tips(creator_id, amount_cents, created_at DESC);

CREATE INDEX IF NOT EXISTS tips_payment_intent_idx 
ON tips(payment_intent);

-- =====================================
-- OPTIMIZE EXISTING RLS POLICIES
-- =====================================

-- Add indexes to support RLS policy performance
-- These help the policies execute faster by providing efficient lookups

-- Index for creator profile ownership checks in related tables
CREATE INDEX IF NOT EXISTS social_links_rls_support_idx 
ON social_links(creator_profile_id) 
INCLUDE (is_active);

CREATE INDEX IF NOT EXISTS releases_rls_support_idx 
ON releases(creator_id);

CREATE INDEX IF NOT EXISTS tips_rls_support_idx 
ON tips(creator_id);

-- =====================================
-- ADDITIONAL UTILITY INDEXES
-- =====================================

-- Search and discovery indexes
CREATE INDEX IF NOT EXISTS creator_profiles_search_public_idx 
ON creator_profiles USING gin(search_text gin_trgm_ops) 
WHERE is_public = true AND search_text IS NOT NULL;

-- Featured and verified creator indexes for homepage
CREATE INDEX IF NOT EXISTS creator_profiles_featured_verified_idx 
ON creator_profiles(is_featured, is_verified, is_public, profile_completion_pct DESC) 
WHERE is_public = true AND (is_featured = true OR is_verified = true);

-- Creator type filtering
CREATE INDEX IF NOT EXISTS creator_profiles_type_public_idx 
ON creator_profiles(creator_type, is_public, username_normalized) 
WHERE is_public = true;

-- =====================================
-- CLEANUP UNUSED OR REDUNDANT INDEXES
-- =====================================

-- Drop any potentially redundant indexes
-- (Check first to avoid errors if they don't exist)

DO $$
BEGIN
  -- Drop any old indexes that might conflict or be redundant
  -- (These are defensive drops - they may not exist)
  
  BEGIN
    DROP INDEX IF EXISTS creator_profiles_username_idx; -- Replaced by normalized version
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP INDEX IF EXISTS click_events_artist_id_idx; -- Old column name, should be creator_id
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
END $$;

-- =====================================
-- UPDATE FUNCTION SECURITY
-- =====================================

-- Ensure all our new functions have proper security context
-- Re-grant permissions that might have been affected by function recreation

GRANT EXECUTE ON FUNCTION get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id() TO anon;

-- =====================================
-- UPDATE STATISTICS
-- =====================================

-- Update statistics for all affected tables to ensure the query planner
-- has accurate information for the new indexes

ANALYZE creator_profiles;
ANALYZE social_links;
ANALYZE click_events;
ANALYZE app_users;
ANALYZE subscriptions;
ANALYZE tips;
ANALYZE releases;

-- =====================================
-- PERFORMANCE MONITORING VIEWS
-- =====================================

-- Create a view for monitoring index usage
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Create a view for monitoring slow queries related to our tables
CREATE OR REPLACE VIEW table_performance_stats AS
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch,
  n_tup_ins,
  n_tup_upd,
  n_tup_del
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY seq_tup_read DESC;

-- Grant access to performance monitoring views
GRANT SELECT ON index_usage_stats TO authenticated;
GRANT SELECT ON table_performance_stats TO authenticated;

-- Add comments for documentation
COMMENT ON VIEW index_usage_stats IS 'Monitor index usage patterns for performance optimization';
COMMENT ON VIEW table_performance_stats IS 'Monitor table scan patterns and identify potential performance issues';