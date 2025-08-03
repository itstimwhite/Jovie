-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text not null,
  created_at timestamptz default now()
);

-- artists
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
  created_at timestamptz default now()
);

-- social_links
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  platform text not null,
  url text not null,
  clicks int default 0,
  created_at timestamptz default now()
);

-- releases
create table if not exists releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  dsp text not null,
  title text not null,
  url text not null,
  release_date date,
  created_at timestamptz default now()
);

-- click_events
create table if not exists click_events (
  id bigserial primary key,
  artist_id uuid references artists(id) on delete cascade,
  link_type text not null, -- 'listen' | 'social'
  target text not null,
  ua text,
  platform_detected text,
  created_at timestamptz default now()
);

-- subscriptions (placeholder)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  plan text not null,
  status text not null,
  revenuecat_id text,
  created_at timestamptz default now()
);

-- RLS
alter table users enable row level security;
alter table artists enable row level security;
alter table social_links enable row level security;
alter table releases enable row level security;
alter table click_events enable row level security;
alter table subscriptions enable row level security;

-- Policies
create policy "users self access" on users
  for select using (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "users insert self" on users
  for insert with check (clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "artist public read" on artists
  for select using (published = true);

create policy "artist owner rw" on artists
  for all using (owner_user_id in (select id from users where clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'));

create policy "social by artist owner" on social_links
  for all using (artist_id in (select a.id from artists a join users u on a.owner_user_id=u.id where u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'));

create policy "social public read" on social_links
  for select using (artist_id in (select id from artists where published = true));

create policy "releases by artist owner" on releases
  for all using (artist_id in (select a.id from artists a join users u on a.owner_user_id=u.id where u.clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'));

create policy "releases public read" on releases
  for select using (artist_id in (select id from artists where published = true));

create policy "clicks readable public" on click_events
  for select using (true);

create policy "clicks insert any" on click_events
  for insert with check (true);

create policy "subscriptions self access" on subscriptions
  for all using (user_id in (select id from users where clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'));

-- Indexes for performance
create index if not exists users_clerk_id_idx on users(clerk_id);
create index if not exists artists_handle_idx on artists(handle);
create index if not exists artists_owner_user_id_idx on artists(owner_user_id);
create index if not exists social_links_artist_id_idx on social_links(artist_id);
create index if not exists releases_artist_id_idx on releases(artist_id);
create index if not exists click_events_artist_id_idx on click_events(artist_id);
create index if not exists click_events_created_at_idx on click_events(created_at);

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (clerk_id, email)
  values (new.id, new.email_addresses[1]::jsonb->>'email_address');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
-- Note: This would typically be set up via Clerk webhooks in production

-- Function to increment clicks on social links
create or replace function increment_clicks(link_id uuid)
returns void as $$
begin
  update social_links 
  set clicks = clicks + 1 
  where id = link_id;
end;
$$ language plpgsql security definer;