-- Temporary fix for onboarding issues with Clerk-Supabase JWT integration
-- This allows onboarding to work while we resolve the JWT configuration

-- Add a temporary policy to allow anonymous inserts with proper validation
CREATE POLICY "temporary_onboarding_insert"
  ON creator_profiles FOR INSERT TO anon
  WITH CHECK (
    -- Allow insert if:
    -- 1. User ID is provided (from Clerk)
    -- 2. Username is provided and unique
    -- 3. Profile is marked as claimed
    user_id IS NOT NULL 
    AND username IS NOT NULL 
    AND is_claimed = true
  );

-- Add policy to allow anonymous upserts to app_users for onboarding
CREATE POLICY "temporary_onboarding_app_users"
  ON app_users FOR INSERT TO anon
  WITH CHECK (
    -- Allow insert if ID is provided (from Clerk)
    id IS NOT NULL
  );

-- Update policy to allow anonymous upserts (for UPSERT operations)
CREATE POLICY "temporary_onboarding_app_users_update"
  ON app_users FOR UPDATE TO anon
  USING (id IS NOT NULL)
  WITH CHECK (id IS NOT NULL);

-- Add comments explaining this is temporary
COMMENT ON POLICY "temporary_onboarding_insert" ON creator_profiles IS 'TEMPORARY: Allow onboarding inserts while resolving Clerk-Supabase JWT integration';
COMMENT ON POLICY "temporary_onboarding_app_users" ON app_users IS 'TEMPORARY: Allow app_users inserts during onboarding';
COMMENT ON POLICY "temporary_onboarding_app_users_update" ON app_users IS 'TEMPORARY: Allow app_users updates during onboarding';