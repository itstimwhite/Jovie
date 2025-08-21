-- Fix RLS policies to work with service role for onboarding
-- Migration: 20250820000010_fix_rls_for_onboarding

-- Add service role policy for creator_profiles insert during onboarding
CREATE POLICY "service_role_insert_creator_profiles" 
ON creator_profiles FOR INSERT TO service_role 
WITH CHECK (true);

-- Add service role policy for app_users upsert during onboarding  
CREATE POLICY "service_role_upsert_app_users"
ON app_users FOR ALL TO service_role
WITH CHECK (true);

-- Add service role policy to read creator_profiles for username checks
CREATE POLICY "service_role_read_creator_profiles"
ON creator_profiles FOR SELECT TO service_role
USING (true);

-- Comment for documentation
COMMENT ON POLICY "service_role_insert_creator_profiles" ON creator_profiles IS 'Allows service role to insert creator profiles during onboarding';
COMMENT ON POLICY "service_role_upsert_app_users" ON app_users IS 'Allows service role to upsert app users during onboarding';
COMMENT ON POLICY "service_role_read_creator_profiles" ON creator_profiles IS 'Allows service role to read creator profiles for username validation';