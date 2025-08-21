-- Fix onboarding to work with Clerk authentication instead of service role
-- This migration ensures RLS policies work correctly with Clerk JWT tokens

-- Drop service role policies that bypass RLS
DROP POLICY IF EXISTS "service_role_insert_creator_profiles" ON creator_profiles;
DROP POLICY IF EXISTS "service_role_upsert_app_users" ON app_users;
DROP POLICY IF EXISTS "service_role_read_creator_profiles" ON creator_profiles;

-- Drop temporary anon policies
DROP POLICY IF EXISTS "app_users_insert_anon_onboarding" ON app_users;
DROP POLICY IF EXISTS "app_users_update_anon_onboarding" ON app_users;
DROP POLICY IF EXISTS "app_users_select_anon_onboarding" ON app_users;
DROP POLICY IF EXISTS "temporary_onboarding_app_users" ON app_users;
DROP POLICY IF EXISTS "temporary_onboarding_app_users_update" ON app_users;

-- Ensure RLS is enabled on all tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

-- === APP_USERS POLICIES ===
-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "app_users_select_own" ON app_users;
DROP POLICY IF EXISTS "app_users_insert_own" ON app_users;
DROP POLICY IF EXISTS "app_users_update_own" ON app_users;

-- Allow authenticated users to manage their own data
CREATE POLICY "app_users_select_own" ON app_users
  FOR SELECT TO authenticated
  USING (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_insert_own" ON app_users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_update_own" ON app_users
  FOR UPDATE TO authenticated
  USING (id = auth.jwt()->>'sub')
  WITH CHECK (id = auth.jwt()->>'sub');

-- === CREATOR_PROFILES POLICIES ===
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "creator_profiles_select_public" ON creator_profiles;
DROP POLICY IF EXISTS "creator_profiles_insert_own" ON creator_profiles;
DROP POLICY IF EXISTS "creator_profiles_update_own" ON creator_profiles;

-- Public profiles can be viewed by anyone
CREATE POLICY "creator_profiles_select_public" ON creator_profiles
  FOR SELECT TO authenticated, anon
  USING (is_public = true);

-- Authenticated users can view their own profile regardless of public status
CREATE POLICY "creator_profiles_select_own" ON creator_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.jwt()->>'sub');

-- Authenticated users can insert their own profile during onboarding
CREATE POLICY "creator_profiles_insert_own" ON creator_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- Authenticated users can update their own profile
CREATE POLICY "creator_profiles_update_own" ON creator_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- Allow authenticated users to check username availability (read usernames only)
CREATE POLICY "creator_profiles_check_username" ON creator_profiles
  FOR SELECT TO authenticated
  USING (true);

-- === PERFORMANCE OPTIMIZATIONS ===
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_creator_profiles_username ON creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_app_users_id ON app_users(id);

-- Add comments for documentation
COMMENT ON POLICY "app_users_select_own" ON app_users IS 'Users can view their own app_users record';
COMMENT ON POLICY "app_users_insert_own" ON app_users IS 'Users can create their own app_users record during onboarding';
COMMENT ON POLICY "app_users_update_own" ON app_users IS 'Users can update their own app_users record';

COMMENT ON POLICY "creator_profiles_select_public" ON creator_profiles IS 'Public profiles are viewable by everyone';
COMMENT ON POLICY "creator_profiles_select_own" ON creator_profiles IS 'Users can always view their own profile';
COMMENT ON POLICY "creator_profiles_insert_own" ON creator_profiles IS 'Users can create their own profile during onboarding';
COMMENT ON POLICY "creator_profiles_update_own" ON creator_profiles IS 'Users can update their own profile';
COMMENT ON POLICY "creator_profiles_check_username" ON creator_profiles IS 'Authenticated users can check username availability';