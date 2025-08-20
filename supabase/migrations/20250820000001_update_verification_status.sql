-- Update verification status for profiles
-- Only 'tim' should be verified, all others should be false

-- First ensure all profiles have is_verified set to false (this is the default)
UPDATE creator_profiles 
SET is_verified = false 
WHERE is_verified IS NULL OR is_verified = true;

-- Then set tim as the only verified profile
UPDATE creator_profiles 
SET is_verified = true 
WHERE username = 'tim';

-- Add comment to clarify the field's purpose
COMMENT ON COLUMN creator_profiles.is_verified IS 'Whether the profile has been verified by the platform. Default is false.';