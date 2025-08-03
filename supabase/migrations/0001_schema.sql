-- Jovie Database Schema
-- This migration creates the complete database schema without any seed data
-- All data should be loaded via the seed.sql file

-- users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  handle text UNIQUE NOT NULL,
  spotify_id text NOT NULL,
  name text NOT NULL,
  image_url text,
  tagline text,
  theme jsonb,
  settings jsonb DEFAULT jsonb_build_object('hide_branding', false),
  published boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  clicks int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- releases table
CREATE TABLE IF NOT EXISTS releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  dsp text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  release_date date,
  created_at timestamptz DEFAULT now()
);

-- click_events table
CREATE TABLE IF NOT EXISTS click_events (
  id bigserial PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  link_type text NOT NULL, -- 'listen' | 'social'
  target text NOT NULL,
  ua text,
  platform_detected text,
  created_at timestamptz DEFAULT now()
);

-- subscriptions table (placeholder for future use)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status text NOT NULL,
  revenuecat_id text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_handle ON artists(handle);
CREATE INDEX IF NOT EXISTS idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX IF NOT EXISTS idx_artists_published ON artists(published);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON artists(is_verified);
CREATE INDEX IF NOT EXISTS idx_social_links_artist_id ON social_links(artist_id);
CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_click_events_artist_id ON click_events(artist_id);
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "users_self_access" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Artists policies
CREATE POLICY "artists_public_read" ON artists
  FOR SELECT USING (published = true);

CREATE POLICY "artists_owner_rw" ON artists
  FOR ALL USING (owner_user_id IN (
    SELECT id FROM users 
    WHERE clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

-- Social links policies
CREATE POLICY "social_links_by_artist_owner" ON social_links
  FOR ALL USING (artist_id IN (
    SELECT a.id FROM artists a 
    JOIN users u ON a.owner_user_id = u.id 
    WHERE u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

CREATE POLICY "social_links_public_read" ON social_links
  FOR SELECT USING (artist_id IN (
    SELECT id FROM artists WHERE published = true
  ));

-- Releases policies
CREATE POLICY "releases_by_artist_owner" ON releases
  FOR ALL USING (artist_id IN (
    SELECT a.id FROM artists a 
    JOIN users u ON a.owner_user_id = u.id 
    WHERE u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

CREATE POLICY "releases_public_read" ON releases
  FOR SELECT USING (artist_id IN (
    SELECT id FROM artists WHERE published = true
  ));

-- Click events policies
CREATE POLICY "click_events_readable_public" ON click_events
  FOR SELECT USING (true);

CREATE POLICY "click_events_insertable_public" ON click_events
  FOR INSERT WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "subscriptions_user_access" ON subscriptions
  FOR ALL USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));
