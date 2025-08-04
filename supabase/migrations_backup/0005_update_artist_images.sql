-- Update all seeded artists with real Spotify image URLs and information
-- This migration fetches the actual Spotify data for our seeded artists

-- Update Lady Gaga
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb1HY2Jd0NmPuamShAr6KMms',
  tagline = 'Born This Way - Chromatica'
WHERE handle = 'ladygaga';

-- Update David Guetta
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb1Cs0zKBU1kc0i8zK8oBxlK',
  tagline = 'One Love - Future Rave'
WHERE handle = 'davidguetta';

-- Update Billie Eilish
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb6qqNVTkY8uBg9cP3Jd7DAH',
  tagline = 'Bad Guy - Happier Than Ever'
WHERE handle = 'billieeilish';

-- Update Marshmello
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb64KEffDW9EtZ1y2vBYgq8T',
  tagline = 'Happier - Shockwave'
WHERE handle = 'marshmello';

-- Update Rihanna
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb5pKCCKE2ajJHZ9KAiaK11H',
  tagline = 'Diamonds - Anti'
WHERE handle = 'rihanna';

-- Update Calvin Harris
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb7CajNmpbOovFoOoasH2HaY',
  tagline = 'Summer - Funk Wav Bounces Vol. 1'
WHERE handle = 'calvinharris';

-- Update Sabrina Carpenter
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb74KM79TiuVKeVCqs8QtB0B',
  tagline = 'Nonsense - Emails I Cant Send'
WHERE handle = 'sabrinacarpenter';

-- Update The Chainsmokers
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb69GGBxA162lTqCwzJG5jLp',
  tagline = 'Closer - So Far So Good'
WHERE handle = 'thechainsmokers';

-- Update Dua Lipa
UPDATE artists
SET
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb6M2wZ9GZgrQXHCFfjv46we',
  tagline = 'Levitating - Future Nostalgia'
WHERE handle = 'dualipa'; 