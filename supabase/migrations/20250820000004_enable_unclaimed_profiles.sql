-- Enable unclaimed profiles that can be claimed by users later
-- This allows pre-populating artist profiles without requiring a user account

-- Step 1: Make user_id nullable in creator_profiles
ALTER TABLE creator_profiles 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Add is_claimed field to track claimed status
ALTER TABLE creator_profiles 
ADD COLUMN is_claimed BOOLEAN DEFAULT false;

-- Set existing profiles with user_id as claimed
UPDATE creator_profiles 
SET is_claimed = true 
WHERE user_id IS NOT NULL;

-- Step 3: Add claim_token for secure claiming process (optional for future use)
ALTER TABLE creator_profiles 
ADD COLUMN claim_token TEXT UNIQUE;

-- Step 4: Add claimed_at timestamp
ALTER TABLE creator_profiles 
ADD COLUMN claimed_at TIMESTAMPTZ;

-- Update claimed_at for existing claimed profiles
UPDATE creator_profiles 
SET claimed_at = created_at 
WHERE is_claimed = true;

-- Step 5: Update RLS policies to handle unclaimed profiles

-- Drop existing policies that will be recreated
DROP POLICY IF EXISTS "creator_public_read" ON creator_profiles;
DROP POLICY IF EXISTS "creator_auth_read_public_or_self" ON creator_profiles;
DROP POLICY IF EXISTS "creator_insert_owner" ON creator_profiles;
DROP POLICY IF EXISTS "creator_update_owner" ON creator_profiles;
DROP POLICY IF EXISTS "creator_delete_owner" ON creator_profiles;

-- Recreate policies with support for unclaimed profiles

-- Anonymous users can read public profiles (claimed or unclaimed)
CREATE POLICY "creator_public_read"
  ON creator_profiles FOR SELECT TO anon
  USING (is_public = true);

-- Authenticated users can read public profiles or their own
CREATE POLICY "creator_auth_read_public_or_self"
  ON creator_profiles FOR SELECT TO authenticated
  USING (
    is_public = true 
    OR (user_id IS NOT NULL AND user_id = auth.jwt()->>'sub')
  );

-- Authenticated users can insert their own profiles
CREATE POLICY "creator_insert_owner"
  ON creator_profiles FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.jwt()->>'sub'
    OR (user_id IS NULL AND auth.jwt()->>'role' = 'service_role') -- Allow service role to create unclaimed profiles
  );

-- Authenticated users can update their own profiles or claim unclaimed ones
CREATE POLICY "creator_update_owner"
  ON creator_profiles FOR UPDATE TO authenticated
  USING (
    -- Can update if you own it
    (user_id IS NOT NULL AND user_id = auth.jwt()->>'sub')
    -- Or if it's unclaimed and you're claiming it (will be enforced in app logic)
    OR (user_id IS NULL AND is_claimed = false)
  )
  WITH CHECK (
    -- After update, must either still be owned by you or newly claimed by you
    (user_id IS NOT NULL AND user_id = auth.jwt()->>'sub')
    OR (user_id IS NULL AND auth.jwt()->>'role' = 'service_role')
  );

-- Only owners can delete their profiles (unclaimed profiles can't be deleted by users)
CREATE POLICY "creator_delete_owner"
  ON creator_profiles FOR DELETE TO authenticated
  USING (
    user_id IS NOT NULL 
    AND user_id = auth.jwt()->>'sub'
  );

-- Step 6: Create function to claim a profile (for future use)
CREATE OR REPLACE FUNCTION claim_creator_profile(
  profile_id UUID,
  claiming_user_id TEXT,
  provided_claim_token TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- Get the profile
  SELECT * INTO profile_record
  FROM creator_profiles
  WHERE id = profile_id
  FOR UPDATE;

  -- Check if profile exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Check if already claimed
  IF profile_record.is_claimed = true OR profile_record.user_id IS NOT NULL THEN
    RAISE EXCEPTION 'Profile already claimed';
  END IF;

  -- If claim token is required and provided, verify it
  IF profile_record.claim_token IS NOT NULL THEN
    IF provided_claim_token IS NULL OR profile_record.claim_token != provided_claim_token THEN
      RAISE EXCEPTION 'Invalid claim token';
    END IF;
  END IF;

  -- Claim the profile
  UPDATE creator_profiles
  SET 
    user_id = claiming_user_id,
    is_claimed = true,
    claimed_at = NOW(),
    claim_token = NULL -- Clear the claim token
  WHERE id = profile_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_is_claimed ON creator_profiles(is_claimed);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id_null ON creator_profiles(user_id) WHERE user_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_creator_profiles_claim_token ON creator_profiles(claim_token) WHERE claim_token IS NOT NULL;

-- Step 8: Add comments for documentation
COMMENT ON COLUMN creator_profiles.is_claimed IS 'Whether this profile has been claimed by a user. Unclaimed profiles can be pre-populated.';
COMMENT ON COLUMN creator_profiles.claim_token IS 'Optional token required to claim this profile. Provides additional security for high-value profiles.';
COMMENT ON COLUMN creator_profiles.claimed_at IS 'Timestamp when the profile was claimed by a user.';
COMMENT ON FUNCTION claim_creator_profile IS 'Securely claim an unclaimed creator profile. Validates ownership and optional claim token.';