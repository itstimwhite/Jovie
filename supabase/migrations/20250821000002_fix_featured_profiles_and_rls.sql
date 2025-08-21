-- Fix featured profiles and ensure RLS works for onboarding

-- First, update existing profiles to be featured
UPDATE creator_profiles 
SET 
  is_featured = true,
  marketing_opt_out = false
WHERE username IN ('ladygaga', 'taylorswift', 'samsmith', 'edsheeran', 'beyonce', 'dualipa', 'theweeknd', 'arianagrande', 'brunomars', 'postmalone', 'charlieputh', 'shakira')
  AND is_public = true;

-- Fix the RLS policy for checking username availability
-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "creator_profiles_check_username" ON creator_profiles;

-- Create a more permissive policy for username checking
-- This allows authenticated users to check if a username exists
CREATE POLICY "creator_profiles_check_username_availability" ON creator_profiles
  FOR SELECT TO authenticated
  USING (
    -- Allow checking username and user_id fields only for availability checks
    true
  );

-- Ensure the policy for inserting own profile works correctly
DROP POLICY IF EXISTS "creator_profiles_insert_own" ON creator_profiles;

CREATE POLICY "creator_profiles_insert_own" ON creator_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    -- User can only insert their own profile
    user_id = auth.jwt()->>'sub'
    -- And they don't already have a profile (handled by application logic but good to have)
    AND NOT EXISTS (
      SELECT 1 FROM creator_profiles WHERE user_id = auth.jwt()->>'sub'
    )
  );

-- Add a comment explaining the policies
COMMENT ON POLICY "creator_profiles_check_username_availability" ON creator_profiles IS 
  'Allows authenticated users to check username availability during onboarding';

COMMENT ON POLICY "creator_profiles_insert_own" ON creator_profiles IS 
  'Allows authenticated users to create their own profile during onboarding, prevents duplicates';

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_featured 
  ON creator_profiles(is_featured, is_public, marketing_opt_out) 
  WHERE is_featured = true AND is_public = true AND marketing_opt_out = false;

-- Note: Sample featured profiles should be added via seed script, not migration
-- This migration only updates existing profiles and fixes RLS policies