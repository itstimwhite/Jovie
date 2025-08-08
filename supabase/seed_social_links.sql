-- Social links seed data with real Spotify and Apple Music URLs
-- This file contains all social links data that was previously in migrations

-- Add Spotify links for all artists
INSERT INTO social_links (artist_id, platform, url) 
SELECT id, 'spotify', 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms' FROM artists WHERE handle = 'ladygaga'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/1Cs0zKBU1kc0i8ypK3B9ai' FROM artists WHERE handle = 'davidguetta'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH' FROM artists WHERE handle = 'billieeilish'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T' FROM artists WHERE handle = 'marshmello'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H' FROM artists WHERE handle = 'rihanna'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY' FROM artists WHERE handle = 'calvinharris'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/74KM79TiuVKeVCqs8QtB0B' FROM artists WHERE handle = 'sabrinacarpenter'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/69GGBxA162lTqCwzJG5jLp' FROM artists WHERE handle = 'thechainsmokers'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we' FROM artists WHERE handle = 'dualipa'
UNION ALL
SELECT id, 'spotify', 'https://open.spotify.com/artist/4Uwpa6zW3zzCSQvooQNksm' FROM artists WHERE handle = 'tim'
ON CONFLICT DO NOTHING;

-- Add Apple Music links for all artists
INSERT INTO social_links (artist_id, platform, url) 
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/lady-gaga/277293880' FROM artists WHERE handle = 'ladygaga'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/david-guetta/5468295' FROM artists WHERE handle = 'davidguetta'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/billie-eilish/1065981054' FROM artists WHERE handle = 'billieeilish'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/marshmello/1115976606' FROM artists WHERE handle = 'marshmello'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/rihanna/52486395' FROM artists WHERE handle = 'rihanna'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/calvin-harris/40265304' FROM artists WHERE handle = 'calvinharris'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/sabrina-carpenter/1141195867' FROM artists WHERE handle = 'sabrinacarpenter'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/the-chainsmokers/1001089062' FROM artists WHERE handle = 'thechainsmokers'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/dua-lipa/1109397171' FROM artists WHERE handle = 'dualipa'
UNION ALL
SELECT id, 'apple_music', 'https://music.apple.com/us/artist/tim-white/1664648289' FROM artists WHERE handle = 'tim'
ON CONFLICT DO NOTHING;

-- Add sample social links for demonstration (Instagram, Twitter, TikTok)
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

-- Tim White's specific social links (override generic ones)
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
SELECT id, 'website', 'https://timwhite.co/' FROM tim_artist
ON CONFLICT (artist_id, platform) DO UPDATE SET url = EXCLUDED.url; 