-- Artist seed data
-- This file contains all artist data that was previously in migrations

-- Insert seed artists with correct Spotify IDs and updated information
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published, is_verified) VALUES
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', 'https://i.scdn.co/image/ab6761610000e5eb1HY2Jd0NmPuamShAr6KMms', 'Born This Way - Chromatica', true, false),
  ('davidguetta', '1Cs0zKBU1kc0i8ypK3B9ai', 'David Guetta', 'https://i.scdn.co/image/ab6761610000e5eb1Cs0zKBU1kc0i8zK8oBxlK', 'One Love - Future Rave', true, false),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', 'https://i.scdn.co/image/ab6761610000e5eb6qqNVTkY8uBg9cP3Jd7DAH', 'Bad Guy - Happier Than Ever', true, false),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', 'https://i.scdn.co/image/ab6761610000e5eb64KEffDW9EtZ1y2vBYgq8T', 'Happier - Shockwave', true, false),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', 'https://i.scdn.co/image/ab6761610000e5eb5pKCCKE2ajJHZ9KAiaK11H', 'Diamonds - Anti', true, false),
  ('calvinharris', '7CajNmpbOovFoOoasH2HaY', 'Calvin Harris', 'https://i.scdn.co/image/ab6761610000e5eb7CajNmpbOovFoOoasH2HaY', 'Summer - Funk Wav Bounces Vol. 1', true, false),
  ('sabrinacarpenter', '74KM79TiuVKeVCqs8QtB0B', 'Sabrina Carpenter', 'https://i.scdn.co/image/ab6761610000e5eb74KM79TiuVKeVCqs8QtB0B', 'Nonsense - Emails I Cant Send', true, false),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', 'https://i.scdn.co/image/ab6761610000e5eb69GGBxA162lTqCwzJG5jLp', 'Closer - So Far So Good', true, false),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', 'https://i.scdn.co/image/ab6761610000e5eb6M2wZ9GZgrQXHCFfjv46we', 'Levitating - Future Nostalgia', true, false),
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', 'https://i.scdn.co/image/ab6761610000e5eb4Uwpa6zW3zzCSQvooQNksm', 'Never Say A Word - 2024', true, true)
ON CONFLICT (handle) DO UPDATE SET
  spotify_id = EXCLUDED.spotify_id,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  tagline = EXCLUDED.tagline,
  published = EXCLUDED.published,
  is_verified = EXCLUDED.is_verified; 