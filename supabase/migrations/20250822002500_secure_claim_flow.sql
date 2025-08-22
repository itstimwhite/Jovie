-- =====================================
-- SECURE CLAIM FLOW HARDENING
-- =====================================
-- Migration: 20250822002500_secure_claim_flow
-- Purpose: Create SECURITY DEFINER functions for controlled claim flow operations
--
-- Changes:
-- 1. Create secure claim profile function
-- 2. Create secure profile update function for unclaimed profiles
-- 3. Remove broad UPDATE RLS policies for unclaimed profiles
-- 4. Implement controlled access via functions only

-- Function to securely claim an unclaimed profile
CREATE OR REPLACE FUNCTION claim_profile_secure(
  profile_id_param uuid,
  claim_token_param text,
  claiming_user_id text
)
RETURNS TABLE(success boolean, message text, profile_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record creator_profiles%ROWTYPE;
  user_exists boolean := false;
BEGIN
  -- Input validation
  IF profile_id_param IS NULL OR claim_token_param IS NULL OR claiming_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Missing required parameters'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Verify the claiming user exists in app_users
  SELECT EXISTS(SELECT 1 FROM app_users WHERE id = claiming_user_id) INTO user_exists;
  IF NOT user_exists THEN
    RETURN QUERY SELECT false, 'User not found'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Get the profile and verify it can be claimed
  SELECT * INTO profile_record
  FROM creator_profiles
  WHERE id = profile_id_param
  AND is_claimed = false
  AND user_id IS NULL
  AND claim_token = claim_token_param;
  
  IF profile_record.id IS NULL THEN
    RETURN QUERY SELECT false, 'Profile not found, already claimed, or invalid token'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Check if user already has a profile with the same username
  IF EXISTS(
    SELECT 1 FROM creator_profiles 
    WHERE user_id = claiming_user_id 
    AND username_normalized = profile_record.username_normalized
  ) THEN
    RETURN QUERY SELECT false, 'User already has a profile with this username'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Perform the claim operation
  UPDATE creator_profiles 
  SET 
    user_id = claiming_user_id,
    is_claimed = true,
    claimed_at = now(),
    claim_token = NULL,  -- Clear the token after successful claim
    updated_at = now(),
    updated_by = claiming_user_id
  WHERE id = profile_id_param;
  
  -- Return success
  RETURN QUERY SELECT true, 'Profile claimed successfully'::text, profile_id_param;
END;
$$;

-- Function to securely update unclaimed profiles (limited fields only)
CREATE OR REPLACE FUNCTION update_unclaimed_profile_secure(
  profile_id_param uuid,
  display_name_param text DEFAULT NULL,
  bio_param text DEFAULT NULL,
  avatar_url_param text DEFAULT NULL,
  spotify_url_param text DEFAULT NULL,
  apple_music_url_param text DEFAULT NULL,
  youtube_url_param text DEFAULT NULL
)
RETURNS TABLE(success boolean, message text, profile_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_exists boolean := false;
BEGIN
  -- Verify the profile exists and is unclaimed
  SELECT EXISTS(
    SELECT 1 FROM creator_profiles 
    WHERE id = profile_id_param 
    AND is_claimed = false 
    AND user_id IS NULL
  ) INTO profile_exists;
  
  IF NOT profile_exists THEN
    RETURN QUERY SELECT false, 'Profile not found or already claimed'::text, NULL::uuid;
    RETURN;
  END IF;
  
  -- Update only allowed fields for unclaimed profiles
  UPDATE creator_profiles 
  SET 
    display_name = COALESCE(display_name_param, display_name),
    bio = COALESCE(bio_param, bio),
    avatar_url = COALESCE(avatar_url_param, avatar_url),
    spotify_url = COALESCE(spotify_url_param, spotify_url),
    apple_music_url = COALESCE(apple_music_url_param, apple_music_url),
    youtube_url = COALESCE(youtube_url_param, youtube_url),
    updated_at = now(),
    updated_by = 'anonymous_update'
  WHERE id = profile_id_param;
  
  -- Return success
  RETURN QUERY SELECT true, 'Profile updated successfully'::text, profile_id_param;
END;
$$;

-- Function to generate claim tokens for new unclaimed profiles
CREATE OR REPLACE FUNCTION generate_claim_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Generate a secure random token (32 characters)
  RETURN encode(gen_random_bytes(24), 'base64');
END;
$$;

-- Function to create unclaimed profile securely
CREATE OR REPLACE FUNCTION create_unclaimed_profile_secure(
  username_param text,
  display_name_param text DEFAULT NULL,
  creator_type_param creator_type DEFAULT 'artist'
)
RETURNS TABLE(success boolean, message text, profile_id uuid, claim_token text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_profile_id uuid;
  new_claim_token text;
  username_exists boolean := false;
BEGIN
  -- Input validation
  IF username_param IS NULL OR trim(username_param) = '' THEN
    RETURN QUERY SELECT false, 'Username is required'::text, NULL::uuid, NULL::text;
    RETURN;
  END IF;
  
  -- Check username format
  IF NOT (username_param ~ '^[a-zA-Z0-9_-]{3,30}$') THEN
    RETURN QUERY SELECT false, 'Username must be 3-30 characters, alphanumeric with underscores and hyphens only'::text, NULL::uuid, NULL::text;
    RETURN;
  END IF;
  
  -- Check if username already exists (case-insensitive)
  SELECT EXISTS(
    SELECT 1 FROM creator_profiles 
    WHERE username_normalized = lower(username_param)
  ) INTO username_exists;
  
  IF username_exists THEN
    RETURN QUERY SELECT false, 'Username already exists'::text, NULL::uuid, NULL::text;
    RETURN;
  END IF;
  
  -- Generate claim token
  new_claim_token := generate_claim_token();
  
  -- Create the unclaimed profile
  INSERT INTO creator_profiles (
    user_id,
    creator_type,
    username,
    display_name,
    is_claimed,
    claim_token,
    is_public,
    created_by,
    updated_by
  ) VALUES (
    NULL,  -- unclaimed
    creator_type_param,
    username_param,
    display_name_param,
    false,  -- unclaimed
    new_claim_token,
    true,   -- public by default
    'anonymous_creation',
    'anonymous_creation'
  )
  RETURNING id INTO new_profile_id;
  
  -- Return success with profile ID and claim token
  RETURN QUERY SELECT true, 'Unclaimed profile created successfully'::text, new_profile_id, new_claim_token;
END;
$$;

-- Update RLS policies to restrict direct updates on unclaimed profiles
-- Drop the existing broad policy that allows updates on unclaimed profiles
DROP POLICY IF EXISTS "creator_profiles_owner_update" ON creator_profiles;

-- Create more restrictive policies
-- Authenticated users can only update their own claimed profiles
CREATE POLICY "creator_profiles_owner_update_claimed" ON creator_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.jwt()->>'sub' AND is_claimed = true)
  WITH CHECK (user_id = auth.jwt()->>'sub' AND is_claimed = true);

-- Block direct updates to unclaimed profiles (must use functions)
CREATE POLICY "creator_profiles_unclaimed_no_direct_update" ON creator_profiles
  FOR UPDATE
  USING (NOT (is_claimed = false AND user_id IS NULL));

-- Allow inserts for authenticated users (for creating new profiles)
CREATE POLICY "creator_profiles_auth_insert" ON creator_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub' OR user_id IS NULL);

-- Block anonymous inserts (must use function)
CREATE POLICY "creator_profiles_anon_no_direct_insert" ON creator_profiles
  FOR INSERT TO anon
  WITH CHECK (false);

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION claim_profile_secure(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_unclaimed_profile_secure(uuid, text, text, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION create_unclaimed_profile_secure(text, text, creator_type) TO anon;
GRANT EXECUTE ON FUNCTION generate_claim_token() TO anon;

-- Add helpful comments
COMMENT ON FUNCTION claim_profile_secure IS 'Secure function for claiming unclaimed profiles with validation';
COMMENT ON FUNCTION update_unclaimed_profile_secure IS 'Secure function for updating unclaimed profiles with limited field access';
COMMENT ON FUNCTION create_unclaimed_profile_secure IS 'Secure function for creating unclaimed profiles anonymously';
COMMENT ON FUNCTION generate_claim_token IS 'Generate secure claim token for unclaimed profiles';

-- Update table statistics
ANALYZE creator_profiles;