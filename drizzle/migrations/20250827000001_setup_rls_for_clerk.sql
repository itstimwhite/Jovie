-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- Create function to get current Clerk user ID from session
CREATE OR REPLACE FUNCTION current_clerk_user_id() 
RETURNS TEXT AS $$
BEGIN
  -- Try to get from session variable first (for server-side operations)
  BEGIN
    RETURN current_setting('app.clerk_user_id', TRUE);
  EXCEPTION WHEN OTHERS THEN
    -- If session variable not available, return NULL
    -- In production, you might want to parse JWT here
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table RLS policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT 
  USING (clerk_id = current_clerk_user_id());

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (clerk_id = current_clerk_user_id());

DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT 
  WITH CHECK (clerk_id = current_clerk_user_id());

-- Creator profiles RLS policies
DROP POLICY IF EXISTS "Users can view own profiles" ON creator_profiles;
CREATE POLICY "Users can view own profiles" ON creator_profiles
  FOR SELECT 
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_clerk_user_id()
    )
    OR is_public = true
  );

DROP POLICY IF EXISTS "Users can update own profiles" ON creator_profiles;
CREATE POLICY "Users can update own profiles" ON creator_profiles
  FOR UPDATE 
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "Users can insert own profiles" ON creator_profiles;
CREATE POLICY "Users can insert own profiles" ON creator_profiles
  FOR INSERT 
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_clerk_user_id()
    )
  );

-- Social links RLS policies
DROP POLICY IF EXISTS "Users can view own social links" ON social_links;
CREATE POLICY "Users can view own social links" ON social_links
  FOR SELECT 
  USING (
    creator_profile_id IN (
      SELECT cp.id FROM creator_profiles cp
      JOIN users u ON u.id = cp.user_id
      WHERE u.clerk_id = current_clerk_user_id()
    )
    OR creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can manage own social links" ON social_links;
CREATE POLICY "Users can manage own social links" ON social_links
  FOR ALL 
  USING (
    creator_profile_id IN (
      SELECT cp.id FROM creator_profiles cp
      JOIN users u ON u.id = cp.user_id
      WHERE u.clerk_id = current_clerk_user_id()
    )
  );

-- Click events RLS policies (users can only view their own analytics)
DROP POLICY IF EXISTS "Users can view own click events" ON click_events;
CREATE POLICY "Users can view own click events" ON click_events
  FOR SELECT 
  USING (
    creator_profile_id IN (
      SELECT cp.id FROM creator_profiles cp
      JOIN users u ON u.id = cp.user_id
      WHERE u.clerk_id = current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert click events" ON click_events;
CREATE POLICY "Anyone can insert click events" ON click_events
  FOR INSERT 
  WITH CHECK (true); -- Allow anonymous click tracking