-- Seed Tim White artist profile
-- Spotify ID: 4Uwpa6zW3zzCSQvooQNksm
-- Handle: tim
-- Social links extracted from timwhite.co

-- Insert Tim White artist profile
INSERT INTO artists (handle, spotify_id, name, image_url, tagline, published) VALUES
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', 'https://i.scdn.co/image/ab6761610000e5eb4Uwpa6zW3zzCSQvooQNksm', 'Artist', true)
ON CONFLICT (handle) DO NOTHING;

-- Insert social links for Tim White
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

-- Insert latest release (Never Say A Word - 2024)
WITH tim_artist AS (
  SELECT id FROM artists WHERE handle = 'tim'
)
INSERT INTO releases (artist_id, dsp, title, url, release_date) 
SELECT id, 'spotify', 'Never Say A Word', 'https://open.spotify.com/track/never-say-a-word-2024', '2024-06-21' FROM tim_artist
ON CONFLICT DO NOTHING; 