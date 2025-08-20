-- Create click_events table for analytics tracking
create table if not exists click_events (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references creator_profiles(id) on delete cascade,
  link_type text not null, -- 'social', 'listen', 'tip', etc.
  target text not null, -- the platform/service clicked (spotify, instagram, etc.)
  ua text, -- user agent for analytics
  platform_detected text, -- detected platform (mobile, desktop, etc.)
  created_at timestamptz default now()
);

-- Create indices for performance
create index if not exists click_events_artist_id_idx on click_events(artist_id);
create index if not exists click_events_created_at_idx on click_events(created_at);
create index if not exists click_events_link_type_idx on click_events(link_type);

-- Enable RLS
alter table click_events enable row level security;

-- Allow authenticated users to insert click events
create policy "Users can insert click events" on click_events
  for insert to authenticated
  with check (true);

-- Allow users to view click events for their own profiles
create policy "Users can view their own click events" on click_events
  for select to authenticated
  using (
    artist_id in (
      select id from creator_profiles 
      where user_id = auth.jwt()->>'sub'
    )
  );

-- Create function to increment social link clicks (if social_links table exists)
create or replace function increment_clicks(link_id uuid)
returns void as $$
begin
  -- This function will be updated when social_links table is implemented
  -- For now, it's a no-op to prevent API errors
  return;
end;
$$ language plpgsql security definer;