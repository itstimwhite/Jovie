-- Add social_links table for creator profiles
-- This table allows creators to have multiple social media links beyond the main streaming platforms

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references creator_profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  display_text text, -- Optional custom display text (e.g., "@username" or "Official Website")
  sort_order integer default 0, -- For custom ordering of links
  clicks integer default 0,
  is_active boolean default true, -- Allow creators to hide/show links temporarily
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Ensure unique platform per creator profile
  unique(creator_profile_id, platform)
);

-- Enable RLS
alter table social_links enable row level security;

-- RLS POLICIES FOR SOCIAL_LINKS

-- Anonymous users can read social links for public profiles
create policy "social_links_public_read"
  on social_links for select to anon
  using (
    exists (
      select 1 from creator_profiles cp 
      where cp.id = social_links.creator_profile_id 
      and cp.is_public = true
    )
    and is_active = true
  );

-- Authenticated users can read social links for public profiles or their own
create policy "social_links_auth_read"
  on social_links for select to authenticated
  using (
    exists (
      select 1 from creator_profiles cp 
      where cp.id = social_links.creator_profile_id 
      and (cp.is_public = true or cp.user_id = auth.jwt()->>'sub')
    )
  );

-- Only profile owners can insert/update/delete their social links
create policy "social_links_owner_insert"
  on social_links for insert to authenticated
  with check (
    exists (
      select 1 from creator_profiles cp 
      where cp.id = social_links.creator_profile_id 
      and cp.user_id = auth.jwt()->>'sub'
    )
  );

create policy "social_links_owner_update"
  on social_links for update to authenticated
  using (
    exists (
      select 1 from creator_profiles cp 
      where cp.id = social_links.creator_profile_id 
      and cp.user_id = auth.jwt()->>'sub'
    )
  );

create policy "social_links_owner_delete"
  on social_links for delete to authenticated
  using (
    exists (
      select 1 from creator_profiles cp 
      where cp.id = social_links.creator_profile_id 
      and cp.user_id = auth.jwt()->>'sub'
    )
  );

-- INDEXES for performance
create index social_links_creator_profile_id_idx on social_links(creator_profile_id);
create index social_links_platform_idx on social_links(platform);
create index social_links_active_idx on social_links(is_active) where is_active = true;
create index social_links_sort_order_idx on social_links(creator_profile_id, sort_order);

-- GRANTS
grant select on social_links to anon;
grant select, insert, update, delete on social_links to authenticated;
grant usage on all sequences in schema public to authenticated;

-- Apply updated_at trigger to social_links
create trigger update_social_links_updated_at
  before update on social_links
  for each row
  execute function update_updated_at_column();