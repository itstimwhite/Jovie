-- Migration: Fix Clerk JWT integration
-- Created: 2025-08-07 19:45:00 UTC
-- Purpose: Fix JWT verification error by using native auth.jwt() approach
-- Affected tables: All tables with RLS policies

-- =============================================================================
-- FIX CLERK JWT INTEGRATION
-- =============================================================================

-- Drop existing policies that use the custom functions FIRST
drop policy if exists "users_self_access" on users;
drop policy if exists "users_insert_self" on users;
drop policy if exists "artists_owner_rw" on artists;
drop policy if exists "social_links_by_artist_owner" on social_links;
drop policy if exists "releases_by_artist_owner" on releases;
drop policy if exists "subscriptions_user_access" on subscriptions;

-- Now drop the custom JWT verification functions that are causing issues
drop function if exists public.verify_clerk_jwt(text);
drop function if exists public.current_user_id();
drop function if exists public.current_clerk_id();

-- =============================================================================
-- CREATE SIMPLIFIED RLS POLICIES USING auth.jwt()
-- =============================================================================

-- Users table policies
create policy "users_self_access" on users
  for select using (
    auth.jwt()->>'sub' = clerk_id
  );

create policy "users_insert_self" on users
  for insert with check (
    auth.jwt()->>'sub' = clerk_id
  );

-- Artists table policies
create policy "artists_owner_rw" on artists
  for all using (
    owner_user_id in (
      select id from users 
      where clerk_id = auth.jwt()->>'sub'
    )
  );

-- Social links table policies
create policy "social_links_by_artist_owner" on social_links
  for all using (
    artist_id in (
      select a.id from artists a 
      join users u on a.owner_user_id = u.id 
      where u.clerk_id = auth.jwt()->>'sub'
    )
  );

-- Releases table policies
create policy "releases_by_artist_owner" on releases
  for all using (
    artist_id in (
      select a.id from artists a 
      join users u on a.owner_user_id = u.id 
      where u.clerk_id = auth.jwt()->>'sub'
    )
  );

-- Subscriptions table policies
create policy "subscriptions_user_access" on subscriptions
  for all using (
    user_id in (
      select id from users 
      where clerk_id = auth.jwt()->>'sub'
    )
  );

-- =============================================================================
-- ADD PUBLIC ACCESS POLICIES FOR FEATURED ARTISTS
-- =============================================================================

-- Drop existing public policies first
drop policy if exists "artists_public_read" on artists;
drop policy if exists "social_links_public_read" on social_links;
drop policy if exists "releases_public_read" on releases;

-- Allow public read access to published artists
create policy "artists_public_read" on artists
  for select using (published = true);

-- Allow public read access to social links for published artists
create policy "social_links_public_read" on social_links
  for select using (
    artist_id in (
      select id from artists where published = true
    )
  );

-- Allow public read access to releases for published artists
create policy "releases_public_read" on releases
  for select using (
    artist_id in (
      select id from artists where published = true
    )
  );

-- =============================================================================
-- VERIFY POLICIES ARE WORKING
-- =============================================================================

-- Test query to verify policies are working
-- This will be executed by the application
-- select count(*) from artists where published = true;
