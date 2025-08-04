-- Social links seed data
-- This file contains all social links data that was previously in migrations

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
SELECT id, 'website', 'https://timwhite.co/' FROM tim_artist
ON CONFLICT DO NOTHING; 