-- Baseline Migration: Complete Clerk-Supabase Integration
-- This is the single source of truth for the database schema
-- Replaces all previous migrations with a clean, simplified schema

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- CLEAN SLATE: Drop all existing tables if they exist
drop table if exists public.artists cascade;
drop table if exists public.users cascade;
drop table if exists public.app_users cascade;
drop table if exists public.artist_profiles cascade;
drop table if exists public.creator_profiles cascade;

-- Remove any legacy functions
drop function if exists public.verify_clerk_jwt(text);
drop function if exists public.get_current_user_id();

-- USERS TABLE (app domain) - stores Clerk user data
create table app_users (
  id text primary key,              -- Clerk user id (sub)
  email text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table app_users enable row level security;

-- Creator type enum
create type creator_type as enum ('artist', 'podcaster', 'influencer', 'creator');

-- CREATOR PROFILES - public or private creator data
create table creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references app_users(id) on delete cascade,
  creator_type creator_type not null default 'artist',
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  -- Music platform URLs (for artists)
  spotify_url text,
  apple_music_url text,
  youtube_url text,
  spotify_id text, -- for backwards compatibility
  -- Visibility and metadata
  is_public boolean not null default true,
  is_verified boolean not null default false,
  settings jsonb default '{"hide_branding": false}'::jsonb,
  theme jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table creator_profiles enable row level security;

-- RLS POLICIES FOR APP_USERS
-- Users can only read/write their own data using auth.jwt()->>'sub'
create policy "users_owner_select"
  on app_users for select to authenticated
  using (id = auth.jwt()->>'sub');

create policy "users_owner_insert"
  on app_users for insert to authenticated
  with check (id = auth.jwt()->>'sub');

create policy "users_owner_update"
  on app_users for update to authenticated
  using (id = auth.jwt()->>'sub')
  with check (id = auth.jwt()->>'sub');

-- RLS POLICIES FOR CREATOR_PROFILES

-- Anonymous users can read public profiles
create policy "creator_public_read"
  on creator_profiles for select to anon
  using (is_public = true);

-- Authenticated users can read public profiles or their own
create policy "creator_auth_read_public_or_self"
  on creator_profiles for select to authenticated
  using (is_public = true OR user_id = auth.jwt()->>'sub');

-- Only owners can insert/update/delete their profile
create policy "creator_insert_owner"
  on creator_profiles for insert to authenticated
  with check (user_id = auth.jwt()->>'sub');

create policy "creator_update_owner"
  on creator_profiles for update to authenticated
  using (user_id = auth.jwt()->>'sub')
  with check (user_id = auth.jwt()->>'sub');

create policy "creator_delete_owner"
  on creator_profiles for delete to authenticated
  using (user_id = auth.jwt()->>'sub');

-- INDEXES for performance
create index creator_profiles_username_idx on creator_profiles(lower(username));
create index creator_profiles_user_id_idx on creator_profiles(user_id);
create index creator_profiles_type_idx on creator_profiles(creator_type);
create index creator_profiles_public_idx on creator_profiles(is_public) where is_public = true;
create index app_users_id_idx on app_users(id);

-- GRANTS
-- Ensure anon role can read public profiles
grant select on creator_profiles to anon;

-- Authenticated users can access both tables through RLS
grant select, insert, update, delete on app_users to authenticated;
grant select, insert, update, delete on creator_profiles to authenticated;

-- Grant usage on sequences
grant usage on all sequences in schema public to authenticated;
grant usage on all sequences in schema public to anon;

-- Updated at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to creator_profiles
create trigger update_creator_profiles_updated_at
  before update on creator_profiles
  for each row
  execute function update_updated_at_column();

-- SEED DATA for development/testing
insert into app_users (id, email) values 
  ('test_user_1', 'test1@example.com'),
  ('test_user_2', 'test2@example.com'),
  ('artist_1', 'ladygaga@example.com'),
  ('artist_5', 'tim@example.com')
on conflict (id) do nothing;

insert into creator_profiles (user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, spotify_id, is_public) values
  ('test_user_1', 'artist', 'testartist1', 'Test Artist One', 'This is a test public artist profile.', null, null, null, true),
  ('test_user_2', 'artist', 'testartist2', 'Test Artist Two', 'This is a test private artist profile.', null, null, null, false),
  ('artist_1', 'artist', 'ladygaga', 'Lady Gaga', 'Grammy Award-winning artist known for hits like "Bad Romance" and "Shallow". Advocate for mental health awareness and LGBTQ+ rights.', 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd', 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms', '1HY2Jd0NmPuamShAr6KMms', true),
  ('artist_5', 'artist', 'tim', 'Tim White', 'Independent artist exploring electronic and ambient sounds. Latest release: "Never Say A Word" (2024).', 'https://i.scdn.co/image/ab6761610000e5ebbab7ca6e76db7da72b58aa5c', null, null, true)
on conflict (username) do nothing;

-- Also create one public profile not attached to any user (for testing anon access)
insert into app_users (id, email) values ('public_test', 'public@example.com') on conflict do nothing;
insert into creator_profiles (user_id, creator_type, username, display_name, bio, avatar_url, is_public) values
  ('public_test', 'artist', 'publicartist', 'Public Test Artist', 'This profile should be visible to everyone.', null, true)
on conflict (username) do nothing;