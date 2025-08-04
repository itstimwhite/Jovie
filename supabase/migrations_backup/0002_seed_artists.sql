-- Seed artists data
-- This migration adds popular artists to the database for testing and demonstration

-- Insert seed artists with real Spotify profile pictures
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published) VALUES
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('davidguetta', '1Cs0zKBU1kc0i8zK8oBxlK', 'David Guetta', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('calvinharris', '7CajNmpbOovfoOQ5XGgU9h', 'Calvin Harris', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('sabrinacarpenter', '1mU3m3BcHkbdQAYM9u0h3q', 'Sabrina Carpenter', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c', 'Artist', true)
ON CONFLICT (handle) DO NOTHING;

-- Add some sample social links for demonstration
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

-- Add some sample releases for demonstration
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