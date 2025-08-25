-- Add Instagram handle fields to creator_profiles table
ALTER TABLE creator_profiles
ADD COLUMN instagram_handle text,
ADD COLUMN instagram_handle_normalized text GENERATED ALWAYS AS (
  CASE 
    WHEN instagram_handle IS NULL THEN NULL
    ELSE lower(regexp_replace(instagram_handle, '^@|^https?://(?:www\.)?instagram\.com/|/$', '', 'g'))
  END
) STORED;

-- Add index for efficient lookups
CREATE INDEX creator_profiles_instagram_handle_normalized_idx ON creator_profiles(instagram_handle_normalized) WHERE instagram_handle_normalized IS NOT NULL;

-- Add comment explaining the fields
COMMENT ON COLUMN creator_profiles.instagram_handle IS 'Instagram handle as entered by user (may include @, instagram.com/, etc.)';
COMMENT ON COLUMN creator_profiles.instagram_handle_normalized IS 'Auto-generated normalized Instagram handle for consistent lookups';

