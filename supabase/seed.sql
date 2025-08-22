-- Fixed seed data for Jovie MVP
-- Matches the schema from 00000000000000_baseline.sql

-- Clear existing data to avoid duplicates
DELETE FROM app_users WHERE id LIKE 'seed_user_%';

-- App users - only add those NOT already in baseline migration
INSERT INTO app_users (id, email) VALUES 
  ('seed_user_1', 'artist1@example.com'),
  ('seed_user_2', 'artist2@example.com'),
  ('seed_user_3', 'artist3@example.com'),
  ('seed_user_4', 'podcaster1@example.com'),
  ('seed_user_5', 'influencer1@example.com'),
  ('seed_user_6', 'newjeans2@example.com'), -- Changed to avoid conflict with tim@example.com
  ('seed_user_14', 'maneskin@example.com'),
  ('seed_user_16', 'lukecombs@example.com');

-- Note: seed_user_7-15 (except 14) are already seeded in the baseline migration

-- Creator profiles - only using columns that exist in baseline schema
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
  is_featured,
  theme,
  settings
) VALUES
  (
    'seed_user_1', 
    'artist', 
    'musicmaker', 
    'Music Maker', 
    'I create electronic music and love to collaborate. Known for ambient soundscapes and deep house tracks that take you on a journey.', 
    '/images/avatars/music-maker.jpg',
    'https://open.spotify.com/artist/example123',
    'https://music.apple.com/us/artist/music-maker/example123',
    'https://youtube.com/@musicmaker',
    'example123spotify',
    true,
    false,
    false,
    null,
    '{"hide_branding": false}'
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
    false,
    null,
    '{"hide_branding": true}'
  ),
  (
    'seed_user_3', 
    'artist', 
    'popstar', 
    'Pop Star', 
    'Chart-topping hits and energetic performances! Latest single "Dreams Come True" out now on all platforms.', 
    '/images/avatars/pop-star.jpg',
    'https://open.spotify.com/artist/popstar456',
    'https://music.apple.com/us/artist/pop-star/456789',
    'https://youtube.com/@popstarofficial',
    'popstar456',
    true,
    true,
    true,
    null,
    '{"hide_branding": false}'
  ),
  (
    'seed_user_4', 
    'podcaster', 
    'techtalks', 
    'Tech Talks Podcast', 
    'Weekly deep dives into the latest technology trends, startup stories, and interviews with industry leaders.', 
    '/images/avatars/tech-talks.jpg',
    null,
    null,
    'https://youtube.com/@techtalks',
    null,
    true,
    false,
    false,
    null,
    '{"hide_branding": false}'
  ),
  (
    'seed_user_5', 
    'influencer', 
    'lifestyleguru', 
    'Lifestyle Guru', 
    'Sharing inspiration for mindful living, wellness tips, and sustainable fashion choices. Join my journey to better living!', 
    '/images/avatars/lifestyle-guru.jpg',
    null,
    null,
    'https://youtube.com/@lifestyleguru',
    null,
    true,
    true,
    false,
    null,
    '{"hide_branding": false}'
  ),
  (
    'seed_user_6', 
    'artist', 
    'tim', 
    'Tim White', 
    'Independent artist exploring electronic and ambient sounds. Latest release: "Never Say A Word" (2024).', 
    'https://i.scdn.co/image/ab6761610000e5ebbab7ca6e76db7da72b58aa5c',
    null,
    null,
    null,
    null,
    true,
    false,
    false,
    null,
    '{"hide_branding": false}'
  ),
  (
    'seed_user_14', 
    'artist', 
    'maneskin', 
    'Måneskin', 
    'Italian rock band that won Eurovision 2021. Known for their energetic performances and hits like "Beggin''" and "I Wanna Be Your Slave".', 
    'https://i.scdn.co/image/ab6761610000e5eb6ebc5eb9e76da4b30e7e6e8b',
    'https://open.spotify.com/artist/3qM84nBOXUEQ2vnTfUTTFC',
    'https://music.apple.com/us/artist/måneskin/1251886477',
    'https://youtube.com/@ManeskinOfficial',
    '3qM84nBOXUEQ2vnTfUTTFC',
    true,
    true,
    false,
    null,
    '{"hide_branding": false}'
  ),
  (
    'seed_user_16', 
    'artist', 
    'lukecombs', 
    'Luke Combs', 
    'Country music superstar with multiple #1 hits. Known for authentic songwriting and powerful vocals in songs like "Hurricane" and "Beautiful Crazy".', 
    'https://i.scdn.co/image/ab6761610000e5eb42d71b5a7a9c96ddb4b8e3d7',
    'https://open.spotify.com/artist/718COspgdWOnwOFpJHRZHS',
    'https://music.apple.com/us/artist/luke-combs/549799352',
    'https://youtube.com/@LukeCombs',
    '718COspgdWOnwOFpJHRZHS',
    true,
    true,
    false,
    null,
    '{"hide_branding": false}'
  )
ON CONFLICT (username_normalized) DO NOTHING;