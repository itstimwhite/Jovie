-- Seed data for new Clerk-Supabase integration schema
-- This file contains minimal seed data for testing the new schema

-- Additional seed data beyond what's in the baseline migration
-- The baseline migration already includes basic test users and profiles

-- Add more diverse test profiles for development
INSERT INTO app_users (id, email) VALUES 
  ('seed_user_1', 'artist1@example.com'),
  ('seed_user_2', 'artist2@example.com'),
  ('seed_user_3', 'artist3@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artist_profiles (user_id, username, display_name, bio, avatar_url, is_public) VALUES
  ('seed_user_1', 'musicmaker', 'Music Maker', 'I create electronic music and love to collaborate.', null, true),
  ('seed_user_2', 'privateartist', 'Private Artist', 'This is a private profile for testing RLS.', null, false),
  ('seed_user_3', 'popstar', 'Pop Star', 'Chart-topping hits and energetic performances!', null, true)
ON CONFLICT (username) DO NOTHING;
