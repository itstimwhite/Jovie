-- Grant necessary permissions for anonymous role during onboarding
-- This allows the temporary onboarding policies to work properly

-- Grant INSERT permissions to anon role for app_users and creator_profiles
GRANT INSERT ON TABLE app_users TO anon;
GRANT UPDATE ON TABLE app_users TO anon;
GRANT SELECT ON TABLE app_users TO anon;

GRANT INSERT ON TABLE creator_profiles TO anon;
GRANT SELECT ON TABLE creator_profiles TO anon;

-- Ensure RLS is enabled
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

-- Note: These grants are temporary for onboarding functionality
-- COMMENT ON GRANT is not valid syntax, using table comments instead
COMMENT ON TABLE app_users IS 'Temporary anonymous permissions granted for onboarding process';
COMMENT ON TABLE creator_profiles IS 'Temporary anonymous permissions granted for onboarding process';