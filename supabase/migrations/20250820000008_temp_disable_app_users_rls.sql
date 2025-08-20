-- Temporary solution: Disable RLS on app_users for onboarding
-- This is a quick fix to allow onboarding to work while we resolve the RLS configuration

-- Disable RLS temporarily on app_users
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;

-- Add a comment explaining this is temporary
COMMENT ON TABLE app_users IS 'TEMPORARY: RLS disabled for onboarding. This should be re-enabled once Clerk-Supabase integration is properly configured.';