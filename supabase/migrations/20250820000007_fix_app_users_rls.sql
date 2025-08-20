-- Fix RLS policies for app_users to allow anonymous inserts during onboarding

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "app_users_select_own" ON app_users;
DROP POLICY IF EXISTS "app_users_insert_own" ON app_users;
DROP POLICY IF EXISTS "app_users_update_own" ON app_users;

-- Create policies for app_users that allow anonymous operations during onboarding
CREATE POLICY "app_users_insert_anon_onboarding"
  ON app_users FOR INSERT TO anon
  WITH CHECK (
    -- Allow insert if ID is provided (from Clerk auth)
    id IS NOT NULL
  );

CREATE POLICY "app_users_update_anon_onboarding"
  ON app_users FOR UPDATE TO anon
  USING (id IS NOT NULL)
  WITH CHECK (id IS NOT NULL);

CREATE POLICY "app_users_select_anon_onboarding"
  ON app_users FOR SELECT TO anon
  USING (id IS NOT NULL);

-- Authenticated users can manage their own data
CREATE POLICY "app_users_select_own"
  ON app_users FOR SELECT TO authenticated
  USING (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_insert_own"
  ON app_users FOR INSERT TO authenticated
  WITH CHECK (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_update_own"
  ON app_users FOR UPDATE TO authenticated
  USING (id = auth.jwt()->>'sub')
  WITH CHECK (id = auth.jwt()->>'sub');

-- Add comments
COMMENT ON POLICY "app_users_insert_anon_onboarding" ON app_users IS 'TEMPORARY: Allow anonymous inserts during onboarding process';
COMMENT ON POLICY "app_users_update_anon_onboarding" ON app_users IS 'TEMPORARY: Allow anonymous updates during onboarding process';
COMMENT ON POLICY "app_users_select_anon_onboarding" ON app_users IS 'TEMPORARY: Allow anonymous selects during onboarding process';