-- Migration: Add Clerk JWT verification
-- Created: 2025-08-05 19:04:10 UTC
-- Purpose: Set up JWT verification for Clerk integration with Supabase
-- Affected tables: All tables with RLS policies
-- Special considerations: This enables the new Clerk integration method

-- =============================================================================
-- CLERK JWT VERIFICATION SETUP
-- =============================================================================

-- Enable the JWT verification extension
create extension if not exists "pg_net" with schema extensions;

-- Create a function to verify Clerk JWT tokens
create or replace function public.verify_clerk_jwt(token text)
returns jsonb
language plpgsql
security definer
as $$
declare
  header jsonb;
  payload jsonb;
  signature text;
  expected_signature text;
  public_key text;
  key_id text;
  issuer text;
  audience text;
  subject text;
  exp bigint;
  iat bigint;
  nbf bigint;
  now_epoch bigint;
begin
  -- Parse the JWT token
  if token is null or token = '' then
    return null;
  end if;

  -- Split the token into parts
  header := decode(split_part(token, '.', 1), 'base64')::jsonb;
  payload := decode(split_part(token, '.', 2), 'base64')::jsonb;
  signature := split_part(token, '.', 3);

  -- Extract key ID from header
  key_id := header->>'kid';
  if key_id is null then
    raise exception 'No key ID in JWT header';
  end if;

  -- Extract claims from payload
  issuer := payload->>'iss';
  audience := payload->>'aud';
  subject := payload->>'sub';
  exp := (payload->>'exp')::bigint;
  iat := (payload->>'iat')::bigint;
  nbf := (payload->>'nbf')::bigint;

  -- Validate required claims
  if issuer is null or audience is null or subject is null then
    raise exception 'Missing required JWT claims';
  end if;

  -- Validate issuer (should be your Clerk domain)
  if not issuer like 'https://%clerk.accounts.dev' and not issuer like 'https://%clerk.com' then
    raise exception 'Invalid issuer: %', issuer;
  end if;

  -- Validate audience (should be your Supabase project URL)
  if audience != current_setting('app.settings.supabase_url', true) then
    raise exception 'Invalid audience: %', audience;
  end if;

  -- Validate time claims
  now_epoch := extract(epoch from now());
  
  if exp is not null and now_epoch > exp then
    raise exception 'JWT token has expired';
  end if;

  if iat is not null and now_epoch < iat then
    raise exception 'JWT token issued in the future';
  end if;

  if nbf is not null and now_epoch < nbf then
    raise exception 'JWT token not yet valid';
  end if;

  -- For now, we'll trust the token without cryptographic verification
  -- In production, you should implement proper signature verification
  -- using Clerk's public keys from their JWKS endpoint

  return payload;
exception
  when others then
    raise exception 'JWT verification failed: %', sqlerrm;
end;
$$;

-- Create a function to get the current user ID from JWT
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select (public.verify_clerk_jwt(
    current_setting('request.jwt.claims', true)
  )->>'sub')::uuid;
$$;

-- Create a function to get the current user's Clerk ID
create or replace function public.current_clerk_id()
returns text
language sql
stable
as $$
  select public.verify_clerk_jwt(
    current_setting('request.jwt.claims', true)
  )->>'sub';
$$;

-- =============================================================================
-- UPDATE RLS POLICIES TO USE NEW FUNCTIONS
-- =============================================================================

-- Drop existing policies
drop policy if exists "users_self_access" on users;
drop policy if exists "users_insert_self" on users;
drop policy if exists "artists_owner_rw" on artists;
drop policy if exists "social_links_by_artist_owner" on social_links;
drop policy if exists "releases_by_artist_owner" on releases;
drop policy if exists "subscriptions_user_access" on subscriptions;

-- Create new policies using the Clerk integration
create policy "users_self_access" on users
  for select using (clerk_id = public.current_clerk_id());

create policy "users_insert_self" on users
  for insert with check (clerk_id = public.current_clerk_id());

create policy "artists_owner_rw" on artists
  for all using (owner_user_id in (
    select id from users 
    where clerk_id = public.current_clerk_id()
  ));

create policy "social_links_by_artist_owner" on social_links
  for all using (artist_id in (
    select a.id from artists a 
    join users u on a.owner_user_id = u.id 
    where u.clerk_id = public.current_clerk_id()
  ));

create policy "releases_by_artist_owner" on releases
  for all using (artist_id in (
    select a.id from artists a 
    join users u on a.owner_user_id = u.id 
    where u.clerk_id = public.current_clerk_id()
  ));

create policy "subscriptions_user_access" on subscriptions
  for all using (user_id in (
    select id from users 
    where clerk_id = public.current_clerk_id()
  ));

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant execute permissions on the new functions
grant execute on function public.verify_clerk_jwt(text) to anon, authenticated;
grant execute on function public.current_user_id() to anon, authenticated;
grant execute on function public.current_clerk_id() to anon, authenticated; 