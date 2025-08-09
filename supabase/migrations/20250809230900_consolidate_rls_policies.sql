-- Migration: Consolidate and document RLS policies for public read access
-- Description: Removes duplicate RLS policies and ensures proper documentation
-- for public read access to published artists and their social_links
-- Created: 2025-08-09
-- 
-- PURPOSE:
-- - Remove duplicate artist RLS policies created by previous migrations
-- - Ensure single, well-documented policy for artists public read access
-- - Verify social_links RLS policy is correctly configured
-- - Add comprehensive SQL comments documenting RLS behavior
-- 
-- ACCEPTANCE CRITERIA:
-- - Anonymous users can SELECT from artists WHERE published = true
-- - Anonymous users can SELECT from social_links for published artists only
-- - Writes remain locked down (no INSERT/UPDATE/DELETE for anonymous users)
-- - Policies are well-documented with SQL comments

-- =============================================================================
-- CLEAN UP DUPLICATE POLICIES
-- =============================================================================

-- Remove the duplicate artist policy from the later migration
-- This keeps the original policy from the initial schema migration
DROP POLICY IF EXISTS "Public can read published artists" ON public.artists;

-- =============================================================================
-- VERIFY AND DOCUMENT EXISTING RLS POLICIES
-- =============================================================================

-- Verify RLS is enabled on required tables
-- (These should already be enabled from initial migration)
ALTER TABLE IF EXISTS public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_links ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ADD COMPREHENSIVE POLICY COMMENTS
-- =============================================================================

-- Document the artists public read policy
-- This policy allows anonymous and authenticated users to read published artists
COMMENT ON POLICY "artists_public_read" ON public.artists IS 
'RLS Policy: Public Read Access for Published Artists

Purpose: Allows anonymous and authenticated users to SELECT from artists table 
where published = true. This enables public artist profile pages and featured 
artists display without requiring authentication.

Security: Write operations (INSERT/UPDATE/DELETE) remain protected.
Used by: Public artist profiles, featured artists carousel, artist directory.';

-- Document the social_links public read policy  
COMMENT ON POLICY "social_links_public_read" ON public.social_links IS
'RLS Policy: Public Read Access for Social Links of Published Artists

Purpose: Allows anonymous and authenticated users to view social links 
belonging to published artists only. Uses subquery to ensure data 
isolation for unpublished artists.

Security: Only social links of published artists are visible. Write operations 
remain protected. Used by: Public artist profile social media sections.';

-- Document the artists owner full access policy
COMMENT ON POLICY "artists_owner_rw" ON public.artists IS
'RLS Policy: Full CRUD Access for Artist Owners

Purpose: Allows artist owners complete control over their artist profiles.
Authentication via Clerk JWT with owner_user_id matching.

Security: Users can only manage artists they own. Used by: Dashboard, 
artist management interface, profile editing.';

-- Document the social_links owner access policy
COMMENT ON POLICY "social_links_by_artist_owner" ON public.social_links IS
'RLS Policy: Full CRUD Access for Social Links by Artist Owners

Purpose: Allows artist owners to manage social links for their artists.
Authentication via Clerk JWT with artist ownership verification.

Security: Users can only manage social links for artists they own.
Used by: Dashboard social links management, profile editing.';

-- =============================================================================
-- VERIFICATION QUERIES (FOR TESTING/DOCUMENTATION)
-- =============================================================================

-- These queries can be used to verify RLS policies work correctly:
--
-- Test 1: Verify anonymous read access to published artists
-- SELECT id, handle, name, published FROM public.artists WHERE published = true;
--
-- Test 2: Verify anonymous access blocked for unpublished artists  
-- SELECT id, handle, name, published FROM public.artists WHERE published = false;
-- (Should return empty result set for anonymous users)
--
-- Test 3: Verify anonymous read access to social links of published artists
-- SELECT sl.* FROM public.social_links sl 
-- JOIN public.artists a ON sl.artist_id = a.id 
-- WHERE a.published = true;
--
-- Test 4: Verify anonymous access blocked for social links of unpublished artists
-- SELECT sl.* FROM public.social_links sl
-- JOIN public.artists a ON sl.artist_id = a.id  
-- WHERE a.published = false;
-- (Should return empty result set for anonymous users)

-- =============================================================================
-- POLICY SUMMARY
-- =============================================================================

-- After this migration, the following RLS policies are active:
--
-- ARTISTS TABLE:
-- 1. "artists_public_read" - Public read access for published artists
-- 2. "artists_owner_rw" - Full access for artist owners
--
-- SOCIAL_LINKS TABLE:  
-- 1. "social_links_public_read" - Public read access for social links of published artists
-- 2. "social_links_by_artist_owner" - Full access for artist owners
--
-- This ensures:
-- ✓ Anonymous SELECT works for published=true artists and their social_links
-- ✓ Writes remain locked down for anonymous users
-- ✓ Artist owners maintain full control over their content
-- ✓ All policies are documented for maintainability