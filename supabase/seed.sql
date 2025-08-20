-- Enhanced seed data for new Clerk-Supabase integration schema
-- This file contains comprehensive seed data for testing all features

-- Additional seed data beyond what's in the baseline migration
-- The baseline migration already includes basic test users and profiles

-- Add more diverse and complete test profiles for development
INSERT INTO app_users (id, email) VALUES 
  ('seed_user_1', 'artist1@example.com'),
  ('seed_user_2', 'artist2@example.com'),
  ('seed_user_3', 'artist3@example.com'),
  ('seed_user_4', 'podcaster1@example.com'),
  ('seed_user_5', 'influencer1@example.com')
ON CONFLICT (id) DO NOTHING;

-- Create comprehensive profiles with all fields populated
INSERT INTO creator_profiles (
  user_id, 
  creator_type, 
  username, 
  display_name, 
  bio, 
  avatar_url, 
  spotify_url, 
  apple_music_url, 
  youtube_url, 
  spotify_id, 
  is_public, 
  is_verified,
  theme,
  settings
) VALUES
  (
    'seed_user_1', 
    'artist', 
    'musicmaker', 
    'Music Maker', 
    'I create electronic music and love to collaborate. Known for ambient soundscapes and deep house tracks that take you on a journey.', 
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face',
    'https://open.spotify.com/artist/example123',
    'https://music.apple.com/us/artist/music-maker/example123',
    'https://youtube.com/@musicmaker',
    'example123spotify',
    true,
    false,
    '{"primaryColor": "#8B5CF6", "backgroundColor": "#1E1B4B", "textColor": "#FFFFFF"}',
    '{"hide_branding": false, "custom_css": null}'
  ),
  (
    'seed_user_2', 
    'artist', 
    'privateartist', 
    'Private Artist', 
    'This is a private profile for testing RLS. Only authenticated users should see this.', 
    null,
    null,
    null,
    null,
    null,
    false,
    false,
    null,
    '{"hide_branding": true}'
  ),
  (
    'seed_user_3', 
    'artist', 
    'popstar', 
    'Pop Star', 
    'Chart-topping hits and energetic performances! 🎤✨ Latest single "Dreams Come True" out now on all platforms.', 
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=face',
    'https://open.spotify.com/artist/popstar456',
    'https://music.apple.com/us/artist/pop-star/456789',
    'https://youtube.com/@popstarofficial',
    'popstar456',
    true,
    true,
    '{"primaryColor": "#EC4899", "backgroundColor": "#FDF2F8", "textColor": "#831843"}',
    '{"hide_branding": false, "custom_css": ".profile-header { background: linear-gradient(45deg, #EC4899, #8B5CF6); }"}'
  ),
  (
    'seed_user_4', 
    'podcaster', 
    'techtalks', 
    'Tech Talks Podcast', 
    'Weekly deep dives into the latest technology trends, startup stories, and interviews with industry leaders.', 
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop&crop=face',
    null,
    null,
    'https://youtube.com/@techtalks',
    null,
    true,
    false,
    '{"primaryColor": "#3B82F6", "backgroundColor": "#EFF6FF", "textColor": "#1E3A8A"}',
    '{"hide_branding": false}'
  ),
  (
    'seed_user_5', 
    'influencer', 
    'lifestyleguru', 
    'Lifestyle Guru', 
    'Sharing daily inspiration, wellness tips, and authentic life moments. Join my journey to mindful living! 🌱', 
    'https://images.unsplash.com/photo-1494790108755-2616c6427c2c?w=400&h=400&fit=crop&crop=face',
    null,
    null,
    'https://youtube.com/@lifestyleguru',
    null,
    true,
    false,
    '{"primaryColor": "#10B981", "backgroundColor": "#ECFDF5", "textColor": "#064E3B"}',
    '{"hide_branding": false, "custom_css": null}'
  )
ON CONFLICT (username) DO NOTHING;
