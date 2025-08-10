-- Comprehensive seed data for Jovie
-- This file contains all seed data consolidated from migration files
-- Run this after the schema migrations to populate the database with test data

-- Artist seed data
-- Insert seed artists with correct Spotify IDs and updated information
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published, is_verified) VALUES
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', 'https://i.scdn.co/image/ab6761610000e5ebaadc18cac8d48124357c38e6', 'Born This Way - Chromatica', true, false),
  ('davidguetta', '1Cs0zKBU1kc0i8ypK3B9ai', 'David Guetta', 'https://i.scdn.co/image/ab6761610000e5ebf150017ca69c8793503c2d4f', 'One Love - Future Rave', true, false),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', 'https://i.scdn.co/image/ab6761610000e5eb4a21b4760d2ecb7b0dcdc8da', 'Bad Guy - Happier Than Ever', true, false),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', 'https://i.scdn.co/image/ab6761610000e5eb3b2498dc8a8c6eceed0a2db3', 'Happier - Shockwave', true, false),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', 'https://i.scdn.co/image/ab6761610000e5eb373e1be0410d4212bf72acab', 'Diamonds - Anti', true, false),
  ('calvinharris', '7CajNmpbOovFoOoasH2HaY', 'Calvin Harris', 'https://i.scdn.co/image/ab6761610000e5eb1e4bcd2bef1896648762dd6b', 'Summer - Funk Wav Bounces Vol. 1', true, false),
  ('sabrinacarpenter', '74KM79TiuVKeVCqs8QtB0B', 'Sabrina Carpenter', 'https://i.scdn.co/image/ab6761610000e5eb78e45cfa4697ce3c437cb455', 'Nonsense - Emails I Cant Send', true, false),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', 'https://i.scdn.co/image/ab6761610000e5eb4567279fac84a0375c3d819b', 'Closer - So Far So Good', true, false),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d', 'Levitating - Future Nostalgia', true, false),
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', 'https://i.scdn.co/image/ab6761610000e5ebbf20a0a1d3bbd4018b4853e6', 'Never Say A Word - 2024', true, true)
ON CONFLICT (handle) DO UPDATE SET
  spotify_id = EXCLUDED.spotify_id,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  tagline = EXCLUDED.tagline,
  published = EXCLUDED.published,
  is_verified = EXCLUDED.is_verified;

-- Social links seed data
-- Add sample social links for demonstration
INSERT INTO social_links (artist_id, platform, url)
SELECT
  a.id,
  'instagram',
  'https://instagram.com/' || a.handle
FROM artists a
WHERE a.handle IN ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
ON CONFLICT DO NOTHING;

INSERT INTO social_links (artist_id, platform, url)
SELECT
  a.id,
  'twitter',
  'https://twitter.com/' || a.handle
FROM artists a
WHERE a.handle IN ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
ON CONFLICT DO NOTHING;

INSERT INTO social_links (artist_id, platform, url)
SELECT
  a.id,
  'tiktok',
  'https://tiktok.com/@' || a.handle
FROM artists a
WHERE a.handle IN ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
ON CONFLICT DO NOTHING;

-- Tim White's social links
WITH tim_artist AS (
  SELECT id FROM artists WHERE handle = 'tim'
)
INSERT INTO social_links (artist_id, platform, url) 
SELECT id, 'twitter', 'https://x.com/itstimwhite' FROM tim_artist
UNION ALL
SELECT id, 'instagram', 'https://instagram.com/itstimwhite' FROM tim_artist
UNION ALL
SELECT id, 'tiktok', 'https://tiktok.com/@itstimwhite' FROM tim_artist
UNION ALL
SELECT id, 'youtube', 'https://youtube.com/@itstimwhite' FROM tim_artist
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/4Uwpa6zW3zzCSQvooQNksm' FROM tim_artist
UNION ALL
SELECT id, 'venmo', 'https://venmo.com/u/itstimwhite' FROM tim_artist
UNION ALL
SELECT id, 'website', 'https://timwhite.co/' FROM tim_artist
ON CONFLICT DO NOTHING;

-- Releases seed data
-- Add sample releases for demonstration
INSERT INTO releases (artist_id, dsp, title, url, release_date)
SELECT
  a.id,
  'spotify',
  'Latest Album',
  'https://open.spotify.com/artist/' || a.spotify_id,
  CURRENT_DATE - INTERVAL '30 days'
FROM artists a
WHERE a.handle IN ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
ON CONFLICT DO NOTHING;

INSERT INTO releases (artist_id, dsp, title, url, release_date)
SELECT
  a.id,
  'apple_music',
  'Latest Single',
  'https://music.apple.com/artist/' || a.spotify_id,
  CURRENT_DATE - INTERVAL '7 days'
FROM artists a
WHERE a.handle IN ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
ON CONFLICT DO NOTHING;

-- Tim White's latest release (Never Say A Word - 2024)
WITH tim_artist AS (
  SELECT id FROM artists WHERE handle = 'tim'
)
INSERT INTO releases (artist_id, dsp, title, url, release_date)
SELECT 
  id, 
  'spotify', 
  'Never Say A Word', 
  'https://open.spotify.com/track/4Uwpa6zW3zzCSQvooQNksm', 
  '2024-01-15'::date
FROM tim_artist
ON CONFLICT DO NOTHING;
