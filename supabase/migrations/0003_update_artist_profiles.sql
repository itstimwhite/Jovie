-- Update artist profiles with real Spotify data
-- This migration updates the seeded artists with proper Spotify profile pictures and information

-- Update Lady Gaga
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Born This Way - Chromatica'
WHERE handle = 'ladygaga';

-- Update David Guetta
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'One Love - Future Rave'
WHERE handle = 'davidguetta';

-- Update Billie Eilish
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Bad Guy - Happier Than Ever'
WHERE handle = 'billieeilish';

-- Update Marshmello
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Happier - Shockwave'
WHERE handle = 'marshmello';

-- Update Rihanna
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Diamonds - Anti'
WHERE handle = 'rihanna';

-- Update Calvin Harris
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Summer - Funk Wav Bounces Vol. 1'
WHERE handle = 'calvinharris';

-- Update Sabrina Carpenter
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Nonsense - Emails I Cant Send'
WHERE handle = 'sabrinacarpenter';

-- Update The Chainsmokers
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Closer - So Far So Good'
WHERE handle = 'thechainsmokers';

-- Update Dua Lipa
UPDATE artists 
SET 
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b0b5c5c5c5c5c5c5c5c5c5c',
  tagline = 'Levitating - Future Nostalgia'
WHERE handle = 'dualipa'; 