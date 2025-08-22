-- =====================================
-- USERNAME UNIQUENESS IMPROVEMENTS
-- =====================================
-- Migration: 20250822001500_username_uniqueness_improvements
-- Purpose: Enforce proper username uniqueness and drop conflicting constraints
--
-- Changes:
-- 1. Ensure single unique index on lower(username) exists
-- 2. Drop any conflicting regex/unique constraints
-- 3. Add validation for username format

-- Check if the normalized username index already exists (it should from baseline)
DO $$
BEGIN
  -- The baseline migration already created creator_profiles_username_normalized_idx
  -- This migration ensures it's properly configured and removes any conflicting constraints
  
  -- Drop any potentially conflicting unique constraints on username (not normalized)
  BEGIN
    ALTER TABLE creator_profiles DROP CONSTRAINT IF EXISTS creator_profiles_username_key;
  EXCEPTION
    WHEN undefined_object THEN
      NULL; -- Constraint doesn't exist, continue
  END;
  
  -- Drop any regex-based constraints that might conflict
  BEGIN
    ALTER TABLE creator_profiles DROP CONSTRAINT IF EXISTS username_format_check;
  EXCEPTION
    WHEN undefined_object THEN
      NULL; -- Constraint doesn't exist, continue
  END;
  
  -- Add a proper username format constraint (alphanumeric, underscores, hyphens, 3-30 chars)
  ALTER TABLE creator_profiles ADD CONSTRAINT username_format_check 
    CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$');
  
  -- Ensure the normalized username index exists (should from baseline but let's be safe)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'creator_profiles' 
    AND indexname = 'creator_profiles_username_normalized_idx'
  ) THEN
    CREATE UNIQUE INDEX creator_profiles_username_normalized_idx 
    ON creator_profiles(username_normalized);
  END IF;
  
END $$;

-- Add a comment to document the username uniqueness strategy
COMMENT ON INDEX creator_profiles_username_normalized_idx 
IS 'Enforces case-insensitive username uniqueness using normalized lowercase values';

COMMENT ON CONSTRAINT username_format_check ON creator_profiles
IS 'Ensures usernames are 3-30 characters, alphanumeric with underscores and hyphens only';

-- Update table statistics
ANALYZE creator_profiles;