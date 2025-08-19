-- Seed specific user data for Tim White
-- Links Clerk user account to the existing tim creator profile

-- Insert/update Tim White's app_user record with specific Clerk ID
INSERT INTO app_users (id, email, created_at) VALUES 
  ('user_31WSX2aM04NNT8bFAQppljnGuGN', 't@timwhite.co', now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;

-- Update the existing tim creator profile to link to the correct user_id
UPDATE creator_profiles 
SET 
  user_id = 'user_31WSX2aM04NNT8bFAQppljnGuGN',
  updated_at = now()
WHERE username = 'tim';

-- Verify the connection was made correctly
-- This should show the tim profile linked to the correct Clerk user
SELECT 
  cp.username,
  cp.display_name,
  cp.user_id,
  au.email
FROM creator_profiles cp
JOIN app_users au ON cp.user_id = au.id
WHERE cp.username = 'tim';