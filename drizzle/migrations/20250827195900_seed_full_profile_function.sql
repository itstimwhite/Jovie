-- RLS-safe seed function to create or update a user, full creator profile, and social links in one call
-- This function sets the Clerk user id session variable internally so RLS INSERT/UPDATE checks pass.

CREATE OR REPLACE FUNCTION seed_create_full_profile(
  p_clerk_user_id text,
  p_email text,
  p_profile jsonb,
  p_social_links jsonb DEFAULT '[]'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_username text;
  v_display_name text;
  v_bio text;
  v_avatar_url text;
  v_spotify_url text;
  v_apple_music_url text;
  v_youtube_url text;
  v_creator_type creator_type := 'artist';
  v_is_public boolean := true;
  v_is_verified boolean := false;
  v_is_featured boolean := false;
BEGIN
  -- Set session variable for RLS in current statement scope
  PERFORM set_config('app.clerk_user_id', p_clerk_user_id, true);

  -- Extract profile fields from JSON
  v_username := NULLIF(TRIM(p_profile->>'username'), '');
  IF v_username IS NULL THEN
    RAISE EXCEPTION 'username is required in p_profile';
  END IF;

  v_display_name := NULLIF(TRIM(p_profile->>'displayName'), '');
  v_bio := NULLIF(p_profile->>'bio', '');
  v_avatar_url := NULLIF(TRIM(p_profile->>'avatarUrl'), '');
  v_spotify_url := NULLIF(TRIM(p_profile->>'spotifyUrl'), '');
  v_apple_music_url := NULLIF(TRIM(p_profile->>'appleMusicUrl'), '');
  v_youtube_url := NULLIF(TRIM(p_profile->>'youtubeUrl'), '');
  v_creator_type := COALESCE((p_profile->>'creatorType')::creator_type, 'artist');
  v_is_public := COALESCE((p_profile->>'isPublic')::boolean, true);
  v_is_verified := COALESCE((p_profile->>'isVerified')::boolean, false);
  v_is_featured := COALESCE((p_profile->>'isFeatured')::boolean, false);

  -- Upsert user by clerk_id
  INSERT INTO users (clerk_id, email)
  VALUES (p_clerk_user_id, p_email)
  ON CONFLICT (clerk_id)
  DO UPDATE SET email = EXCLUDED.email, updated_at = now()
  RETURNING id INTO v_user_id;

  -- Reuse existing profile if any, else insert
  SELECT id INTO v_profile_id FROM creator_profiles WHERE user_id = v_user_id LIMIT 1;

  IF v_profile_id IS NULL THEN
    INSERT INTO creator_profiles (
      user_id,
      creator_type,
      username,
      username_normalized,
      display_name,
      bio,
      avatar_url,
      spotify_url,
      apple_music_url,
      youtube_url,
      is_public,
      is_verified,
      is_featured,
      onboarding_completed_at
    ) VALUES (
      v_user_id,
      v_creator_type,
      v_username,
      lower(v_username),
      COALESCE(v_display_name, v_username),
      v_bio,
      v_avatar_url,
      v_spotify_url,
      v_apple_music_url,
      v_youtube_url,
      v_is_public,
      v_is_verified,
      v_is_featured,
      now()
    ) RETURNING id INTO v_profile_id;
  ELSE
    UPDATE creator_profiles SET
      creator_type = v_creator_type,
      username = v_username,
      username_normalized = lower(v_username),
      display_name = COALESCE(v_display_name, v_username),
      bio = v_bio,
      avatar_url = v_avatar_url,
      spotify_url = v_spotify_url,
      apple_music_url = v_apple_music_url,
      youtube_url = v_youtube_url,
      is_public = v_is_public,
      is_verified = v_is_verified,
      is_featured = v_is_featured,
      updated_at = now()
    WHERE id = v_profile_id;
  END IF;

  -- Replace social links with provided list
  DELETE FROM social_links WHERE creator_profile_id = v_profile_id;

  INSERT INTO social_links (
    creator_profile_id,
    platform,
    platform_type,
    url,
    display_text,
    sort_order
  )
  SELECT
    v_profile_id,
    link_elem->>'platform',
    link_elem->>'platformType',
    link_elem->>'url',
    NULLIF(link_elem->>'displayText', ''),
    COALESCE((link_elem->>'sortOrder')::int, 0)
  FROM jsonb_array_elements(p_social_links) AS link_elem;

  RETURN v_profile_id;
EXCEPTION
  WHEN unique_violation THEN
    -- surface unique violations to caller for mapping
    RAISE;
  WHEN others THEN
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

COMMENT ON FUNCTION seed_create_full_profile(text, text, jsonb, jsonb)
  IS 'RLS-safe: sets session clerk id and creates/updates a user, profile and social links atomically for seed data.';
