-- Fix incorrect Spotify IDs for artists that were returning 404 errors
-- Based on Spotify API search results

-- Update David Guetta with correct Spotify ID
UPDATE artists
SET
  spotify_id = '1Cs0zKBU1kc0i8ypK3B9ai'
WHERE handle = 'davidguetta';

-- Update Calvin Harris with correct Spotify ID
UPDATE artists
SET
  spotify_id = '7CajNmpbOovFoOoasH2HaY'
WHERE handle = 'calvinharris';

-- Update Sabrina Carpenter with correct Spotify ID
UPDATE artists
SET
  spotify_id = '74KM79TiuVKeVCqs8QtB0B'
WHERE handle = 'sabrinacarpenter'; 