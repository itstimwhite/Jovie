-- Add featured creators and marketing opt-out functionality
-- This migration adds fields to control which creators are featured and allows users to opt out of marketing

-- Add is_featured field to control which creators are featured on homepage
ALTER TABLE creator_profiles 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Add marketing_opt_out field to allow users to control their marketing visibility
ALTER TABLE creator_profiles 
ADD COLUMN marketing_opt_out BOOLEAN DEFAULT false;

-- Add comments to explain the fields
COMMENT ON COLUMN creator_profiles.is_featured IS 'Whether this creator should be featured on the homepage and marketing materials. Default is false.';
COMMENT ON COLUMN creator_profiles.marketing_opt_out IS 'Whether the user has opted out of having their profile used in marketing materials. Default is false (they have NOT opted out).';

-- Create an index for efficient querying of featured creators
CREATE INDEX idx_creator_profiles_featured_marketing ON creator_profiles(is_featured, marketing_opt_out, is_public, creator_type) WHERE is_featured = true AND marketing_opt_out = false AND is_public = true;

-- Set some existing creators as featured for testing (only public verified ones)
UPDATE creator_profiles 
SET is_featured = true 
WHERE is_verified = true 
  AND is_public = true 
  AND creator_type = 'artist'
  AND username IN ('tim', 'ladygaga', 'musicmaker', 'popstar');

-- Add RLS policy to allow users to update their own marketing preferences
-- (This allows users to opt out of marketing via dashboard)
CREATE POLICY "Users can update their own marketing preferences" ON creator_profiles
FOR UPDATE 
TO authenticated
USING (auth.jwt()->>'sub' = user_id)
WITH CHECK (auth.jwt()->>'sub' = user_id);