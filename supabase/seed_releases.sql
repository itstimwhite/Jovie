-- Releases seed data
-- This file contains all releases data that was previously in migrations

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