-- =====================================
-- SECURE ANONYMOUS CLICK INGESTION
-- =====================================
-- Migration: 20250822002000_secure_click_ingestion
-- Purpose: Create SECURITY DEFINER function for safe anonymous click tracking
--
-- Changes:
-- 1. Create secure click ingestion function with validation
-- 2. Add performance index on click_events(creator_id, created_at)
-- 3. Update RLS policies to use function-based access
-- 4. Add rate limiting for anonymous clicks

-- Create the secure click ingestion function
CREATE OR REPLACE FUNCTION record_click_secure(
  creator_username text,
  link_type_param link_type_enum,
  target_param text,
  ua_param text DEFAULT NULL,
  platform_param text DEFAULT NULL
)
RETURNS TABLE(success boolean, message text, click_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  creator_uuid uuid;
  new_click_id uuid;
  rate_limit_result record;
  client_ip inet;
BEGIN
  -- Input validation
  IF creator_username IS NULL OR trim(creator_username) = '' THEN
    RETURN QUERY SELECT false, 'Invalid username'::text, NULL::uuid;
    RETURN;
  END IF;
  
  IF target_param IS NULL OR trim(target_param) = '' THEN
    RETURN QUERY SELECT false, 'Invalid target'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Get client IP for rate limiting (from Supabase headers)
  BEGIN
    client_ip := COALESCE(
      inet(current_setting('request.headers', true)::json->>'x-forwarded-for'),
      inet(current_setting('request.headers', true)::json->>'x-real-ip'),
      inet('127.0.0.1')
    );
  EXCEPTION
    WHEN OTHERS THEN
      client_ip := inet('127.0.0.1');
  END;
  
  -- Rate limiting check (max 100 clicks per IP per hour)
  SELECT * INTO rate_limit_result
  FROM check_click_rate_limit(client_ip, 100, 60);
  
  IF NOT rate_limit_result.allowed THEN
    RETURN QUERY SELECT false, 'Rate limit exceeded'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Find creator by normalized username (case-insensitive)
  SELECT id INTO creator_uuid
  FROM creator_profiles 
  WHERE username_normalized = lower(creator_username)
  AND is_public = true
  AND is_claimed = true  -- Only allow clicks for claimed profiles
  LIMIT 1;
  
  IF creator_uuid IS NULL THEN
    RETURN QUERY SELECT false, 'Creator not found or not public'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Insert the click event
  INSERT INTO click_events (creator_id, link_type, target, ua, platform_detected)
  VALUES (creator_uuid, link_type_param, target_param, ua_param, platform_param)
  RETURNING id INTO new_click_id;
  
  -- Return success
  RETURN QUERY SELECT true, 'Click recorded successfully'::text, new_click_id;
END;
$$;

-- Create rate limiting function for click events
CREATE OR REPLACE FUNCTION check_click_rate_limit(
  client_ip_param inet,
  max_clicks integer DEFAULT 100,
  window_minutes integer DEFAULT 60
)
RETURNS TABLE(allowed boolean, remaining_clicks integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_clicks integer := 0;
  window_start timestamptz;
BEGIN
  window_start := now() - (window_minutes || ' minutes')::interval;
  
  -- Count clicks from this IP in the time window
  SELECT COUNT(*) INTO current_clicks
  FROM click_events ce
  JOIN creator_profiles cp ON ce.creator_id = cp.id
  WHERE ce.created_at > window_start
  AND current_setting('request.headers', true)::json->>'x-forwarded-for' = client_ip_param::text;
  
  -- Check if limit exceeded
  IF current_clicks >= max_clicks THEN
    RETURN QUERY SELECT 
      false, 
      0, 
      (now() + (window_minutes || ' minutes')::interval);
    RETURN;
  END IF;
  
  -- Return allowed
  RETURN QUERY SELECT 
    true, 
    (max_clicks - current_clicks), 
    (now() + (window_minutes || ' minutes')::interval);
END;
$$;

-- Add performance index for click analytics
CREATE INDEX IF NOT EXISTS click_events_creator_created_idx 
ON click_events(creator_id, created_at DESC);

-- Add index for rate limiting queries
CREATE INDEX IF NOT EXISTS click_events_created_at_idx 
ON click_events(created_at) 
WHERE created_at > (now() - interval '24 hours');

-- Update RLS policies to be more restrictive
-- Drop the old permissive anonymous insert policy
DROP POLICY IF EXISTS "click_events_anon_insert" ON click_events;

-- Create more restrictive policies
CREATE POLICY "click_events_function_insert" ON click_events
  FOR INSERT 
  WITH CHECK (false); -- Block direct inserts, must use function

CREATE POLICY "click_events_anon_select_none" ON click_events
  FOR SELECT TO anon
  USING (false); -- Anonymous users cannot read click events

-- Owner can still read their own click events
CREATE POLICY "click_events_owner_select" ON click_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = click_events.creator_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

-- Grant execute permission on the new function to anonymous users
GRANT EXECUTE ON FUNCTION record_click_secure(text, link_type_enum, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION check_click_rate_limit(inet, integer, integer) TO anon;

-- Add helpful comments
COMMENT ON FUNCTION record_click_secure IS 'Secure function for anonymous click tracking with validation and rate limiting';
COMMENT ON FUNCTION check_click_rate_limit IS 'Rate limiting function for anonymous click events';

-- Update table statistics
ANALYZE click_events;