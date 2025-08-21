-- Comprehensive onboarding improvements with constraints and optimizations
-- This migration adds database-level constraints, proper indexing, and optimizations

-- Add unique constraint on username if not already present
-- This prevents race conditions and ensures data integrity
DO $$ 
BEGIN
  -- Check if unique constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'creator_profiles_username_unique' 
    AND table_name = 'creator_profiles'
  ) THEN
    ALTER TABLE creator_profiles 
    ADD CONSTRAINT creator_profiles_username_unique UNIQUE (username);
  END IF;
END $$;

-- Add check constraint for username format
-- This enforces validation at the database level
DO $$
BEGIN
  -- Check if constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'creator_profiles_username_format' 
    AND table_name = 'creator_profiles'
  ) THEN
    ALTER TABLE creator_profiles 
    ADD CONSTRAINT creator_profiles_username_format 
    CHECK (
      username ~ '^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$' -- Must start with letter, end with letter/number
      AND length(username) >= 3 
      AND length(username) <= 30
      AND username !~ '__' -- No consecutive underscores
    );
  END IF;
END $$;

-- Add check constraint for display name length
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'creator_profiles_display_name_length' 
    AND table_name = 'creator_profiles'
  ) THEN
    ALTER TABLE creator_profiles 
    ADD CONSTRAINT creator_profiles_display_name_length 
    CHECK (
      display_name IS NULL 
      OR (length(trim(display_name)) >= 1 AND length(trim(display_name)) <= 50)
    );
  END IF;
END $$;

-- Create a dedicated function for username availability checking
-- This function only returns existence, not profile data
CREATE OR REPLACE FUNCTION check_username_availability(username_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
BEGIN
  -- Normalize and validate input
  username_to_check := lower(trim(username_to_check));
  
  -- Basic validation
  IF username_to_check IS NULL OR length(username_to_check) < 3 THEN
    RETURN false;
  END IF;
  
  -- Check if username exists
  RETURN NOT EXISTS (
    SELECT 1 FROM creator_profiles 
    WHERE username = username_to_check
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_username_availability(text) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION check_username_availability(text) IS 
  'Securely check username availability without exposing profile data';

-- Create optimized indexes for common queries
CREATE INDEX IF NOT EXISTS idx_creator_profiles_username_lower 
  ON creator_profiles (lower(username));

CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id_active 
  ON creator_profiles (user_id) 
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_creator_profiles_featured_public 
  ON creator_profiles (is_featured, marketing_opt_out, created_at) 
  WHERE is_public = true AND is_featured = true AND marketing_opt_out = false;

-- Create a rate limiting table for onboarding attempts
CREATE TABLE IF NOT EXISTS onboarding_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  ip_address inet,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamptz DEFAULT now(),
  last_attempt_at timestamptz DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS to rate limiting table
ALTER TABLE onboarding_rate_limit ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own rate limit data
CREATE POLICY "onboarding_rate_limit_own_data" ON onboarding_rate_limit
  FOR ALL TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- Create index for rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_rate_limit_user_id 
  ON onboarding_rate_limit (user_id, last_attempt_at);

CREATE INDEX IF NOT EXISTS idx_onboarding_rate_limit_ip 
  ON onboarding_rate_limit (ip_address, last_attempt_at);

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION check_onboarding_rate_limit(
  user_id_param text,
  ip_address_param inet DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_attempts integer := 5;
  window_minutes integer := 15;
  block_minutes integer := 60;
  current_record record;
  is_blocked boolean := false;
  remaining_attempts integer;
BEGIN
  -- Get current rate limit record
  SELECT * INTO current_record
  FROM onboarding_rate_limit
  WHERE user_id = user_id_param
  ORDER BY last_attempt_at DESC
  LIMIT 1;

  -- If no record exists, create one
  IF current_record IS NULL THEN
    INSERT INTO onboarding_rate_limit (user_id, ip_address)
    VALUES (user_id_param, ip_address_param);
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', max_attempts - 1,
      'reset_at', null
    );
  END IF;

  -- Check if currently blocked
  IF current_record.blocked_until IS NOT NULL 
     AND current_record.blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining_attempts', 0,
      'reset_at', current_record.blocked_until,
      'reason', 'rate_limited'
    );
  END IF;

  -- Check if we're in a new window
  IF current_record.first_attempt_at < (now() - interval '1 minute' * window_minutes) THEN
    -- Reset the window
    UPDATE onboarding_rate_limit
    SET 
      attempt_count = 1,
      first_attempt_at = now(),
      last_attempt_at = now(),
      blocked_until = NULL,
      updated_at = now()
    WHERE id = current_record.id;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', max_attempts - 1,
      'reset_at', null
    );
  END IF;

  -- Increment attempt count
  UPDATE onboarding_rate_limit
  SET 
    attempt_count = attempt_count + 1,
    last_attempt_at = now(),
    updated_at = now(),
    ip_address = COALESCE(ip_address_param, ip_address)
  WHERE id = current_record.id;

  -- Check if we've exceeded max attempts
  IF (current_record.attempt_count + 1) >= max_attempts THEN
    -- Block the user
    UPDATE onboarding_rate_limit
    SET blocked_until = now() + interval '1 minute' * block_minutes
    WHERE id = current_record.id;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining_attempts', 0,
      'reset_at', now() + interval '1 minute' * block_minutes,
      'reason', 'max_attempts_exceeded'
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining_attempts', max_attempts - (current_record.attempt_count + 1),
    'reset_at', null
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_onboarding_rate_limit(text, inet) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE onboarding_rate_limit IS 'Rate limiting for onboarding attempts to prevent abuse';
COMMENT ON FUNCTION check_onboarding_rate_limit(text, inet) IS 'Check and update rate limits for onboarding attempts';

-- Update existing policies to be more specific and performant
-- Drop the broad username checking policy
DROP POLICY IF EXISTS "creator_profiles_check_username_availability" ON creator_profiles;

-- Create a more specific policy just for the username availability function
CREATE POLICY "creator_profiles_username_availability_check" ON creator_profiles
  FOR SELECT TO authenticated
  USING (
    -- Only allow reading username field for availability checks
    current_setting('request.method', true) = 'GET'
    AND current_setting('request.path', true) LIKE '%/check%'
  );

-- Add monitoring columns for observability
ALTER TABLE creator_profiles 
ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Create indexes for monitoring queries
CREATE INDEX IF NOT EXISTS idx_creator_profiles_last_login 
  ON creator_profiles (last_login_at) 
  WHERE last_login_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_creator_profiles_onboarding_completed 
  ON creator_profiles (onboarding_completed_at) 
  WHERE onboarding_completed_at IS NOT NULL;

-- Add trigger to automatically set onboarding_completed_at
CREATE OR REPLACE FUNCTION set_onboarding_completed()
RETURNS trigger AS $$
BEGIN
  -- Set onboarding completed timestamp on insert
  IF TG_OP = 'INSERT' AND NEW.onboarding_completed_at IS NULL THEN
    NEW.onboarding_completed_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS creator_profiles_onboarding_completed ON creator_profiles;
CREATE TRIGGER creator_profiles_onboarding_completed
  BEFORE INSERT ON creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_onboarding_completed();

-- Performance optimization: analyze tables after schema changes
ANALYZE creator_profiles;
ANALYZE onboarding_rate_limit;