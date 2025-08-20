-- Artist seed data
-- This file contains all artist data that was previously in migrations

-- Insert seed artists with real Spotify profile images and updated information
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published, is_verified) VALUES
  -- image_url intentionally NULL; will fetch from Spotify oEmbed/Web API at runtime
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', NULL, 'Artist', true, false),
  ('davidguetta', '1Cs0zKBU1kc0i8ypK3B9ai', 'David Guetta', NULL, 'Artist', true, false),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', NULL, 'Artist', true, false),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', NULL, 'Artist', true, false),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', NULL, 'Artist', true, false),
  ('calvinharris', '7CajNmpbOovFoOoasH2HaY', 'Calvin Harris', NULL, 'Artist', true, false),
  ('sabrinacarpenter', '74KM79TiuVKeVCqs8QtB0B', 'Sabrina Carpenter', NULL, 'Artist', true, false),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', NULL, 'Artist', true, false),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', NULL, 'Artist', true, false),
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', NULL, 'Never Say A Word - 2024', true, true)
ON CONFLICT (handle) DO UPDATE SET
  spotify_id = EXCLUDED.spotify_id,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  tagline = EXCLUDED.tagline,
  published = EXCLUDED.published,
  is_verified = EXCLUDED.is_verified;