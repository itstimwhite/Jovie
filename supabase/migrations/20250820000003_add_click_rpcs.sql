-- Add RPCs for anonymous click logging via SECURITY DEFINER
-- This migration creates:
-- 1) public.increment_clicks(link_id uuid) - hardened implementation
-- 2) public.log_click_event(handle text, link_type text, target text, ua text, platform text, link_id uuid) - main entrypoint for logging clicks from anon/auth users

-- Ensure function is created in the correct schema and safe execution context
set search_path = public;

-- 1) Implement increment_clicks with SECURITY DEFINER (internal use)
create or replace function public.increment_clicks(link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Increment clicks for the given social link id
  update public.social_links
     set clicks = coalesce(clicks, 0) + 1,
         updated_at = now()
   where id = link_id;
end;
$$;

-- Restrict default PUBLIC execute and only allow authenticated role
revoke all on function public.increment_clicks(uuid) from public;
grant execute on function public.increment_clicks(uuid) to authenticated;

-- 2) Main RPC to log click events safely for anonymous users
create or replace function public.log_click_event(
  handle text,
  link_type text,
  target text,
  ua text,
  platform text,
  link_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_id uuid;
  v_click_id uuid;
begin
  -- Resolve creator id from handle (username)
  select id into v_creator_id
    from public.creator_profiles
   where username = handle
   limit 1;

  -- If no creator found, exit gracefully
  if v_creator_id is null then
    return null;
  end if;

  -- Insert click event
  insert into public.click_events(
    id,
    artist_id,
    link_type,
    target,
    ua,
    platform_detected
  ) values (
    gen_random_uuid(),
    v_creator_id,
    link_type,
    target,
    ua,
    platform
  ) returning id into v_click_id;

  -- If social link and link id is provided, increment clicks for that link
  if link_id is not null and link_type = 'social' then
    -- Ensure the link belongs to the same creator to avoid cross-profile tampering
    update public.social_links s
       set clicks = coalesce(clicks, 0) + 1,
           updated_at = now()
     where s.id = link_id
       and s.creator_profile_id = v_creator_id;
  end if;

  return v_click_id;
end;
$$;

-- Allow both anon and authenticated to execute the logging RPC
revoke all on function public.log_click_event(text, text, text, text, text, uuid) from public;
grant execute on function public.log_click_event(text, text, text, text, text, uuid) to anon, authenticated;
