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

-- ARTIST PROFILES - public or private artist data
create table artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references app_users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  is_public boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table artist_profiles enable row level security;

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

-- RLS POLICIES FOR ARTIST_PROFILES

-- Anonymous users can read public profiles
create policy "artist_public_read"
  on artist_profiles for select to anon
  using (is_public = true);

-- Authenticated users can read public profiles or their own
create policy "artist_auth_read_public_or_self"
  on artist_profiles for select to authenticated
  using (is_public = true OR user_id = auth.jwt()->>'sub');

-- Only owners can insert/update/delete their profile
create policy "artist_insert_owner"
  on artist_profiles for insert to authenticated
  with check (user_id = auth.jwt()->>'sub');

create policy "artist_update_owner"
  on artist_profiles for update to authenticated
  using (user_id = auth.jwt()->>'sub')
  with check (user_id = auth.jwt()->>'sub');

create policy "artist_delete_owner"
  on artist_profiles for delete to authenticated
  using (user_id = auth.jwt()->>'sub');

-- INDEXES for performance
create index artist_profiles_username_idx on artist_profiles(lower(username));
create index artist_profiles_user_id_idx on artist_profiles(user_id);
create index artist_profiles_public_idx on artist_profiles(is_public) where is_public = true;
create index app_users_id_idx on app_users(id);

-- GRANTS
-- Ensure anon role can read public profiles
grant select on artist_profiles to anon;

-- Authenticated users can access both tables through RLS
grant select, insert, update, delete on app_users to authenticated;
grant select, insert, update, delete on artist_profiles to authenticated;

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

-- Apply updated_at trigger to artist_profiles
create trigger update_artist_profiles_updated_at
  before update on artist_profiles
  for each row
  execute function update_updated_at_column();

-- SEED DATA for development/testing
insert into app_users (id, email) values 
  ('test_user_1', 'test1@example.com'),
  ('test_user_2', 'test2@example.com')
on conflict (id) do nothing;

insert into artist_profiles (user_id, username, display_name, bio, is_public) values
  ('test_user_1', 'testartist1', 'Test Artist One', 'This is a test public artist profile.', true),
  ('test_user_2', 'testartist2', 'Test Artist Two', 'This is a test private artist profile.', false)
on conflict (username) do nothing;

-- Also create one public profile not attached to any user (for testing anon access)
insert into app_users (id, email) values ('public_test', 'public@example.com') on conflict do nothing;
insert into artist_profiles (user_id, username, display_name, bio, is_public) values
  ('public_test', 'publicartist', 'Public Test Artist', 'This profile should be visible to everyone.', true)
on conflict (username) do nothing;