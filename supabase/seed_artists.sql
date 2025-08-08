-- Artist seed data
-- This file contains all artist data that was previously in migrations

-- Insert seed artists with real Spotify profile images and updated information
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published, is_verified) VALUES
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd', 'Artist', true, false),
  ('davidguetta', '1Cs0zKBU1kc0i8ypK3B9ai', 'David Guetta', 'https://i.scdn.co/image/ab6761610000e5eb150e1b9e6ae26e8d7b3fb5a2', 'Artist', true, false),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', 'https://i.scdn.co/image/ab6761610000e5eb7aa2e8b4b7b87781b1c4dc52', 'Artist', true, false),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', 'https://i.scdn.co/image/ab6761610000e5eba85b8b1a09c9bf5b5e0dad0e', 'Artist', true, false),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', 'https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789', 'Artist', true, false),
  ('calvinharris', '7CajNmpbOovFoOoasH2HaY', 'Calvin Harris', 'https://i.scdn.co/image/ab6761610000e5eb6e1b1bee0e4ea8c2b9e86d53', 'Artist', true, false),
  ('sabrinacarpenter', '74KM79TiuVKeVCqs8QtB0B', 'Sabrina Carpenter', 'https://i.scdn.co/image/ab6761610000e5ebb5ccecf96c0cd5e423f6acaf', 'Artist', true, false),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', 'https://i.scdn.co/image/ab6761610000e5eb04710bb6ccb46e81b96f9fd3', 'Artist', true, false),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', 'https://i.scdn.co/image/ab6761610000e5eb9a0bb7bdffa7893f1d25c326', 'Artist', true, false),
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', 'https://i.scdn.co/image/ab6761610000e5ebbab7ca6e76db7da72b58aa5c', 'Never Say A Word - 2024', true, true)
ON CONFLICT (handle) DO UPDATE SET
  spotify_id = EXCLUDED.spotify_id,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  tagline = EXCLUDED.tagline,
  published = EXCLUDED.published,
  is_verified = EXCLUDED.is_verified; 