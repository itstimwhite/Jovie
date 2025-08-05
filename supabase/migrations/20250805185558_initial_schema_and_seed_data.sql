-- Migration: Initial schema and seed data
-- Created: 2025-08-05 18:55:58 UTC
-- Purpose: Complete database schema setup with seed data for Jovie application
-- Affected tables: users, artists, social_links, releases, click_events, subscriptions
-- Special considerations: This migration combines all previous migrations into a single file

-- =============================================================================
-- SCHEMA CREATION
-- =============================================================================

-- users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text not null,
  created_at timestamptz default now()
);

-- artists table
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references users(id) on delete cascade,
  handle text unique not null,
  spotify_id text not null,
  name text not null,
  image_url text,
  tagline text,
  theme jsonb,
  settings jsonb default jsonb_build_object('hide_branding', false),
  published boolean default true,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- social_links table
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  platform text not null,
  url text not null,
  clicks int default 0,
  created_at timestamptz default now()
);

-- releases table
create table if not exists releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  dsp text not null,
  title text not null,
  url text not null,
  release_date date,
  created_at timestamptz default now()
);

-- click_events table
create table if not exists click_events (
  id bigserial primary key,
  artist_id uuid references artists(id) on delete cascade,
  link_type text not null, -- 'listen' | 'social'
  target text not null,
  ua text,
  platform_detected text,
  created_at timestamptz default now()
);

-- subscriptions table (placeholder for future use)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  plan text not null,
  status text not null,
  revenuecat_id text,
  created_at timestamptz default now()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

create index if not exists idx_artists_handle on artists(handle);
create index if not exists idx_artists_spotify_id on artists(spotify_id);
create index if not exists idx_artists_published on artists(published);
create index if not exists idx_artists_verified on artists(is_verified);
create index if not exists idx_social_links_artist_id on social_links(artist_id);
create index if not exists idx_releases_artist_id on releases(artist_id);
create index if not exists idx_click_events_artist_id on click_events(artist_id);
create index if not exists idx_click_events_created_at on click_events(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables for security
alter table users enable row level security;
alter table artists enable row level security;
alter table social_links enable row level security;
alter table releases enable row level security;
alter table click_events enable row level security;
alter table subscriptions enable row level security;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Users policies - users can only access their own data
create policy "users_self_access" on users
  for select using (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "users_insert_self" on users
  for insert with check (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Artists policies - public read access for published artists, full access for owners
create policy "artists_public_read" on artists
  for select using (published = true);

create policy "artists_owner_rw" on artists
  for all using (owner_user_id in (
    select id from users 
    where clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

-- Social links policies - public read for published artists, full access for owners
create policy "social_links_by_artist_owner" on social_links
  for all using (artist_id in (
    select a.id from artists a 
    join users u on a.owner_user_id = u.id 
    where u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

create policy "social_links_public_read" on social_links
  for select using (artist_id in (
    select id from artists where published = true
  ));

-- Releases policies - public read for published artists, full access for owners
create policy "releases_by_artist_owner" on releases
  for all using (artist_id in (
    select a.id from artists a 
    join users u on a.owner_user_id = u.id 
    where u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

create policy "releases_public_read" on releases
  for select using (artist_id in (
    select id from artists where published = true
  ));

-- Click events policies - public read/write for analytics
create policy "click_events_readable_public" on click_events
  for select using (true);

create policy "click_events_insertable_public" on click_events
  for insert with check (true);

-- Subscriptions policies - users can only access their own subscriptions
create policy "subscriptions_user_access" on subscriptions
  for all using (user_id in (
    select id from users 
    where clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
  ));

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert popular artists for testing and demonstration
insert into artists (handle, spotify_id, name, image_url, tagline, published) values
  ('ladygaga', '1HY2Jd0NmPuamShAr6KMms', 'Lady Gaga', 'https://i.scdn.co/image/ab6761610000e5eb1HY2Jd0NmPuamShAr6KMms', 'Born This Way - Chromatica', true),
  ('davidguetta', '1Cs0zKBU1kc0i8ypK3B9ai', 'David Guetta', 'https://i.scdn.co/image/ab6761610000e5eb1Cs0zKBU1kc0i8ypK3B9ai', 'One Love - Future Rave', true),
  ('billieeilish', '6qqNVTkY8uBg9cP3Jd7DAH', 'Billie Eilish', 'https://i.scdn.co/image/ab6761610000e5eb6qqNVTkY8uBg9cP3Jd7DAH', 'Bad Guy - Happier Than Ever', true),
  ('marshmello', '64KEffDW9EtZ1y2vBYgq8T', 'Marshmello', 'https://i.scdn.co/image/ab6761610000e5eb64KEffDW9EtZ1y2vBYgq8T', 'Happier - Shockwave', true),
  ('rihanna', '5pKCCKE2ajJHZ9KAiaK11H', 'Rihanna', 'https://i.scdn.co/image/ab6761610000e5eb5pKCCKE2ajJHZ9KAiaK11H', 'Diamonds - Anti', true),
  ('calvinharris', '7CajNmpbOovFoOoasH2HaY', 'Calvin Harris', 'https://i.scdn.co/image/ab6761610000e5eb7CajNmpbOovFoOoasH2HaY', 'Summer - Funk Wav Bounces Vol. 1', true),
  ('sabrinacarpenter', '74KM79TiuVKeVCqs8QtB0B', 'Sabrina Carpenter', 'https://i.scdn.co/image/ab6761610000e5eb74KM79TiuVKeVCqs8QtB0B', 'Nonsense - Emails I Cant Send', true),
  ('thechainsmokers', '69GGBxA162lTqCwzJG5jLp', 'The Chainsmokers', 'https://i.scdn.co/image/ab6761610000e5eb69GGBxA162lTqCwzJG5jLp', 'Closer - So Far So Good', true),
  ('dualipa', '6M2wZ9GZgrQXHCFfjv46we', 'Dua Lipa', 'https://i.scdn.co/image/ab6761610000e5eb6M2wZ9GZgrQXHCFfjv46we', 'Levitating - Future Nostalgia', true),
  ('tim', '4Uwpa6zW3zzCSQvooQNksm', 'Tim White', 'https://i.scdn.co/image/ab6761610000e5eb4Uwpa6zW3zzCSQvooQNksm', 'Never Say A Word - 2024', true)
on conflict (handle) do nothing;

-- Mark Tim White as verified (founder)
update artists 
set is_verified = true 
where handle = 'tim';

-- Add social links for all seeded artists
insert into social_links (artist_id, platform, url)
select
  a.id,
  'instagram',
  'https://instagram.com/' || a.handle
from artists a
where a.handle in ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
on conflict do nothing;

insert into social_links (artist_id, platform, url)
select
  a.id,
  'twitter',
  'https://twitter.com/' || a.handle
from artists a
where a.handle in ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
on conflict do nothing;

insert into social_links (artist_id, platform, url)
select
  a.id,
  'tiktok',
  'https://tiktok.com/@' || a.handle
from artists a
where a.handle in ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
on conflict do nothing;

-- Add Tim White's specific social links
with tim_artist as (
  select id from artists where handle = 'tim'
)
insert into social_links (artist_id, platform, url) 
select id, 'twitter', 'https://x.com/itstimwhite' from tim_artist
union all
select id, 'instagram', 'https://instagram.com/itstimwhite' from tim_artist
union all
select id, 'tiktok', 'https://tiktok.com/@itstimwhite' from tim_artist
union all
select id, 'youtube', 'https://youtube.com/@itstimwhite' from tim_artist
union all
select id, 'spotify', 'https://open.spotify.com/artist/4Uwpa6zW3zzCSQvooQNksm' from tim_artist
union all
select id, 'website', 'https://timwhite.co/' from tim_artist
on conflict do nothing;

-- Add sample releases for demonstration
insert into releases (artist_id, dsp, title, url, release_date)
select
  a.id,
  'spotify',
  'Latest Album',
  'https://open.spotify.com/artist/' || a.spotify_id,
  current_date - interval '30 days'
from artists a
where a.handle in ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
on conflict do nothing;

insert into releases (artist_id, dsp, title, url, release_date)
select
  a.id,
  'apple_music',
  'Latest Single',
  'https://music.apple.com/artist/' || a.spotify_id,
  current_date - interval '7 days'
from artists a
where a.handle in ('ladygaga', 'davidguetta', 'billieeilish', 'marshmello', 'rihanna', 'calvinharris', 'sabrinacarpenter', 'thechainsmokers', 'dualipa')
on conflict do nothing;

-- Add Tim White's latest release
with tim_artist as (
  select id from artists where handle = 'tim'
)
insert into releases (artist_id, dsp, title, url, release_date) 
select id, 'spotify', 'Never Say A Word', 'https://open.spotify.com/track/never-say-a-word-2024', '2024-06-21' from tim_artist
on conflict do nothing; 