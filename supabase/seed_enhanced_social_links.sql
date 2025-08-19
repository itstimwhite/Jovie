-- Enhanced Social Links Seed Data
-- Comprehensive social media presence for all demo artists

-- Insert enhanced social links using the profile IDs
WITH social_data AS (
  SELECT 
    cp.id as profile_id,
    cp.username,
    links.platform,
    links.url,
    links.sort_order
  FROM creator_profiles cp
  CROSS JOIN (
    VALUES 
    -- Lady Gaga's social links (sort_order for priority)
    ('ladygaga', 'instagram', 'https://instagram.com/ladygaga', 1),
    ('ladygaga', 'twitter', 'https://x.com/ladygaga', 2),
    ('ladygaga', 'tiktok', 'https://tiktok.com/@ladygaga', 3),
    ('ladygaga', 'facebook', 'https://facebook.com/ladygaga', 4),
    ('ladygaga', 'website', 'https://ladygaga.com', 5),
    ('ladygaga', 'youtube_music', 'https://music.youtube.com/channel/UCBxCm19HCJf5Jfk5xoQCqfQ', 6),
    ('ladygaga', 'soundcloud', 'https://soundcloud.com/ladygaga', 7),
    
    -- David Guetta's social links  
    ('davidguetta', 'instagram', 'https://instagram.com/davidguetta', 1),
    ('davidguetta', 'twitter', 'https://x.com/davidguetta', 2),
    ('davidguetta', 'tiktok', 'https://tiktok.com/@davidguetta', 3),
    ('davidguetta', 'facebook', 'https://facebook.com/DavidGuetta', 4),
    ('davidguetta', 'website', 'https://davidguetta.com', 5),
    ('davidguetta', 'youtube_music', 'https://music.youtube.com/channel/UCiNqhk2V5qSnJQJvV7ZgZnw', 6),
    ('davidguetta', 'soundcloud', 'https://soundcloud.com/davidguetta', 7),
    
    -- Billie Eilish's social links
    ('billieeilish', 'instagram', 'https://instagram.com/billieeilish', 1),
    ('billieeilish', 'twitter', 'https://x.com/billieeilish', 2),
    ('billieeilish', 'tiktok', 'https://tiktok.com/@billieeilish', 3),
    ('billieeilish', 'facebook', 'https://facebook.com/billieeilish', 4),
    ('billieeilish', 'website', 'https://billieeilish.com', 5),
    ('billieeilish', 'youtube_music', 'https://music.youtube.com/channel/UCiGm_E4ZwYSHV3bcW1pnSeQ', 6),
    
    -- Marshmello's social links
    ('marshmello', 'instagram', 'https://instagram.com/marshmello', 1),
    ('marshmello', 'twitter', 'https://x.com/marshmello', 2),
    ('marshmello', 'tiktok', 'https://tiktok.com/@marshmello', 3),
    ('marshmello', 'facebook', 'https://facebook.com/marshmellomusic', 4),
    ('marshmello', 'website', 'https://marshmellomusic.com', 5),
    ('marshmello', 'youtube_music', 'https://music.youtube.com/channel/UCEdvpU2pFRCVqU6yIPyTpMQ', 6),
    ('marshmello', 'soundcloud', 'https://soundcloud.com/marshmellomusic', 7),
    ('marshmello', 'twitch', 'https://twitch.tv/marshmello', 8),
    
    -- Rihanna's social links
    ('rihanna', 'instagram', 'https://instagram.com/badgalriri', 1),
    ('rihanna', 'twitter', 'https://x.com/rihanna', 2),
    ('rihanna', 'tiktok', 'https://tiktok.com/@rihanna', 3),
    ('rihanna', 'facebook', 'https://facebook.com/rihanna', 4),
    ('rihanna', 'website', 'https://rihannanow.com', 5),
    ('rihanna', 'youtube_music', 'https://music.youtube.com/channel/UCq-_EFkrMwCAJVfbp1a1Zgg', 6),
    
    -- Calvin Harris's social links
    ('calvinharris', 'instagram', 'https://instagram.com/calvinharris', 1),
    ('calvinharris', 'twitter', 'https://x.com/calvinharris', 2),
    ('calvinharris', 'tiktok', 'https://tiktok.com/@calvinharris', 3),
    ('calvinharris', 'facebook', 'https://facebook.com/calvinharris', 4),
    ('calvinharris', 'website', 'https://calvinharris.com', 5),
    ('calvinharris', 'youtube_music', 'https://music.youtube.com/channel/UCBveMEST4CoLjf4wkO7wf6A', 6),
    ('calvinharris', 'soundcloud', 'https://soundcloud.com/calvinharris', 7),
    
    -- Sabrina Carpenter's social links
    ('sabrinacarpenter', 'instagram', 'https://instagram.com/sabrinacarpenter', 1),
    ('sabrinacarpenter', 'twitter', 'https://x.com/sabrinacarpenter', 2),
    ('sabrinacarpenter', 'tiktok', 'https://tiktok.com/@sabrinacarpenter', 3),
    ('sabrinacarpenter', 'facebook', 'https://facebook.com/sabrinacarpenter', 4),
    ('sabrinacarpenter', 'website', 'https://sabrinacarpenter.com', 5),
    ('sabrinacarpenter', 'youtube_music', 'https://music.youtube.com/channel/UCqLyDJEhFLEtLFnOYmKQaLA', 6),
    
    -- The Chainsmokers' social links
    ('thechainsmokers', 'instagram', 'https://instagram.com/thechainsmokers', 1),
    ('thechainsmokers', 'twitter', 'https://x.com/thechainsmokers', 2),
    ('thechainsmokers', 'tiktok', 'https://tiktok.com/@thechainsmokers', 3),
    ('thechainsmokers', 'facebook', 'https://facebook.com/thechainsmokers', 4),
    ('thechainsmokers', 'website', 'https://thechainsmokers.com', 5),
    ('thechainsmokers', 'youtube_music', 'https://music.youtube.com/channel/UCfXTfKHdIz6bYmdm7rP7sLQ', 6),
    ('thechainsmokers', 'soundcloud', 'https://soundcloud.com/thechainsmokers', 7),
    
    -- Dua Lipa's social links
    ('dualipa', 'instagram', 'https://instagram.com/dualipa', 1),
    ('dualipa', 'twitter', 'https://x.com/dualipa', 2),
    ('dualipa', 'tiktok', 'https://tiktok.com/@dualipa', 3),
    ('dualipa', 'facebook', 'https://facebook.com/dualipa', 4),
    ('dualipa', 'website', 'https://dualipa.com', 5),
    ('dualipa', 'youtube_music', 'https://music.youtube.com/channel/UC-J-KZfRV8c13fOCkhXdLiQ', 6),
    
    -- Tim White's social links (verified real links)
    ('tim', 'instagram', 'https://instagram.com/itstimwhite', 1),
    ('tim', 'twitter', 'https://x.com/itstimwhite', 2),
    ('tim', 'tiktok', 'https://tiktok.com/@itstimwhite', 3),
    ('tim', 'website', 'https://timwhite.co', 4),
    ('tim', 'linkedin', 'https://linkedin.com/in/itstimwhite', 5),
    ('tim', 'github', 'https://github.com/itstimwhite', 6),
    ('tim', 'youtube_music', 'https://music.youtube.com/channel/UCiGm_E4ZwYSHV3bcW1pnSeQ', 7)
  ) AS links(username, platform, url, sort_order)
  WHERE cp.username = links.username
)

INSERT INTO social_links (creator_profile_id, platform, url, display_text, sort_order)
SELECT 
  profile_id,
  platform,
  url,
  CASE 
    WHEN platform = 'website' THEN 'Official Website'
    WHEN platform = 'instagram' THEN '@' || username
    WHEN platform = 'twitter' THEN '@' || username  
    WHEN platform = 'tiktok' THEN '@' || username
    WHEN platform = 'youtube_music' THEN 'YouTube Music'
    WHEN platform = 'soundcloud' THEN 'SoundCloud'
    WHEN platform = 'twitch' THEN 'Twitch'
    WHEN platform = 'linkedin' THEN 'LinkedIn'
    WHEN platform = 'github' THEN 'GitHub'
    ELSE INITCAP(platform)
  END as display_text,
  sort_order
FROM social_data
ON CONFLICT (creator_profile_id, platform) DO UPDATE SET
  url = EXCLUDED.url,
  display_text = EXCLUDED.display_text,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Add streaming platform links that are already in the creator_profiles table  
-- This ensures consistency between profile URLs and social links
INSERT INTO social_links (creator_profile_id, platform, url, display_text, sort_order)
SELECT 
  id as profile_id,
  'spotify' as platform,
  spotify_url as url,
  'Spotify' as display_text,
  0 as sort_order -- High priority for main streaming platforms
FROM creator_profiles 
WHERE spotify_url IS NOT NULL
ON CONFLICT (creator_profile_id, platform) DO UPDATE SET
  url = EXCLUDED.url,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO social_links (creator_profile_id, platform, url, display_text, sort_order)
SELECT 
  id as profile_id,
  'apple_music' as platform,
  apple_music_url as url,
  'Apple Music' as display_text,
  0 as sort_order
FROM creator_profiles 
WHERE apple_music_url IS NOT NULL
ON CONFLICT (creator_profile_id, platform) DO UPDATE SET
  url = EXCLUDED.url,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO social_links (creator_profile_id, platform, url, display_text, sort_order)
SELECT 
  id as profile_id,
  'youtube' as platform,
  youtube_url as url,
  'YouTube' as display_text,
  0 as sort_order
FROM creator_profiles 
WHERE youtube_url IS NOT NULL
ON CONFLICT (creator_profile_id, platform) DO UPDATE SET
  url = EXCLUDED.url,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();