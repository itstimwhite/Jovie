-- Stored function to create or reuse a user and create a creator profile in one call
-- Ensures RLS session context via set_config and keeps the whole flow in a single statement
-- Compatible with Neon HTTP (no client-side transactions required)

CREATE OR REPLACE FUNCTION onboarding_create_profile(
  p_clerk_user_id text,
  p_email text,
  p_username text,
  p_display_name text DEFAULT NULL,
  p_creator_type creator_type DEFAULT 'artist'
) RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_display_name text;
BEGIN
  -- Set session variable for RLS in current transaction scope
  PERFORM set_config('app.clerk_user_id', p_clerk_user_id, true);

  -- Upsert user (by clerk_id)
  INSERT INTO users (clerk_id, email)
  VALUES (p_clerk_user_id, p_email)
  ON CONFLICT (clerk_id)
  DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now()
  RETURNING id INTO v_user_id;

  -- If user already has a profile, return the existing one (idempotent)
  SELECT id INTO v_profile_id
  FROM creator_profiles
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_profile_id IS NOT NULL THEN
    RETURN v_profile_id;
  END IF;

  -- Normalize/compute display name fallback
  v_display_name := COALESCE(NULLIF(TRIM(p_display_name), ''), p_username);

  -- Create the creator profile
  INSERT INTO creator_profiles (
    user_id,
    creator_type,
    username,
    username_normalized,
    display_name,
    is_public,
    onboarding_completed_at
  ) VALUES (
    v_user_id,
    p_creator_type,
    p_username,
    lower(p_username),
    v_display_name,
    true,
    now()
  ) RETURNING id INTO v_profile_id;

  RETURN v_profile_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Let the caller map specific errors (e.g., unique violations) appropriately
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

COMMENT ON FUNCTION onboarding_create_profile(text, text, text, text, creator_type)
  IS 'Creates or updates user by clerk_id and creates a creator profile atomically with RLS session set.';
