-- =====================================
-- COMPREHENSIVE BASELINE MIGRATION
-- =====================================
-- This migration consolidates all schema changes into a single baseline
-- Includes: core tables, RLS policies, indexes, constraints, functions, and optimizations

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================
-- ENUMS AND TYPES
-- =====================================

-- Creator type enum
CREATE TYPE creator_type AS ENUM ('artist', 'podcaster', 'influencer', 'creator');

-- Link type enum for click tracking
CREATE TYPE link_type_enum AS ENUM ('listen', 'social', 'tip', 'other');

-- Subscription enums
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium', 'pro');
CREATE TYPE subscription_status AS ENUM (
  'active', 'inactive', 'cancelled', 'past_due', 
  'trialing', 'incomplete', 'incomplete_expired', 'unpaid'
);

-- Currency codes enum
CREATE TYPE currency_code AS ENUM (
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 
  'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
);

-- Social platform enum for validation
CREATE TYPE social_platform AS ENUM (
  -- Music Platforms
  'spotify', 'apple_music', 'youtube_music', 'soundcloud', 'bandcamp',
  'tidal', 'deezer', 'amazon_music', 'pandora',
  -- Social Media
  'instagram', 'twitter', 'x', 'tiktok', 'youtube', 'facebook',
  'linkedin', 'snapchat', 'pinterest', 'reddit',
  -- Creator/Content Platforms
  'twitch', 'discord', 'patreon', 'onlyfans', 'substack', 'medium',
  'github', 'behance', 'dribbble',
  -- Link Aggregators
  'linktree', 'beacons', 'linkin_bio', 'allmylinks', 'linkfire', 'toneden',
  -- Payment/Tip Platforms
  'venmo', 'paypal', 'cashapp', 'zelle', 'ko_fi', 'buymeacoffee', 'gofundme',
  -- Messaging/Communication
  'whatsapp', 'telegram', 'signal', 'email', 'phone',
  -- Professional
  'website', 'blog', 'portfolio', 'booking', 'press_kit',
  -- Other
  'other'
);

-- =====================================
-- CORE TABLES
-- =====================================

-- APP USERS TABLE - stores Clerk user data
CREATE TABLE app_users (
  id text PRIMARY KEY,              -- Clerk user id (sub)
  email text,
  -- Billing fields
  is_pro boolean NOT NULL DEFAULT FALSE,
  plan text DEFAULT NULL,
  stripe_customer_id text DEFAULT NULL,
  stripe_subscription_id text DEFAULT NULL,
  billing_updated_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- CREATOR PROFILES - public or private creator data
CREATE TABLE creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NULL REFERENCES app_users(id) ON DELETE CASCADE, -- Nullable for unclaimed profiles
  creator_type creator_type NOT NULL DEFAULT 'artist',
  username text NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  -- Music platform URLs (for artists)
  spotify_url text,
  apple_music_url text,
  youtube_url text,
  spotify_id text,
  -- Visibility and metadata
  is_public boolean NOT NULL DEFAULT TRUE,
  is_verified boolean NOT NULL DEFAULT FALSE,
  is_featured boolean NOT NULL DEFAULT FALSE,
  marketing_opt_out boolean NOT NULL DEFAULT FALSE,
  -- Claiming functionality
  is_claimed boolean NOT NULL DEFAULT TRUE, -- True by default for owned profiles
  claim_token text DEFAULT NULL,
  claimed_at timestamptz DEFAULT NULL,
  -- Monitoring and analytics
  last_login_at timestamptz DEFAULT NULL,
  profile_views integer DEFAULT 0,
  onboarding_completed_at timestamptz DEFAULT NULL,
  -- Generated columns (computed by database)
  username_normalized text GENERATED ALWAYS AS (lower(username)) STORED,
  search_text text GENERATED ALWAYS AS (
    COALESCE(lower(display_name), '') || ' ' ||
    COALESCE(lower(bio), '') || ' ' ||
    COALESCE(lower(username), '')
  ) STORED,
  display_title text GENERATED ALWAYS AS (
    COALESCE(NULLIF(trim(display_name), ''), username)
  ) STORED,
  profile_completion_pct integer GENERATED ALWAYS AS (
    (
      CASE WHEN display_name IS NOT NULL AND trim(display_name) != '' THEN 20 ELSE 0 END +
      CASE WHEN bio IS NOT NULL AND trim(bio) != '' THEN 20 ELSE 0 END +
      CASE WHEN avatar_url IS NOT NULL THEN 20 ELSE 0 END +
      CASE WHEN spotify_url IS NOT NULL OR apple_music_url IS NOT NULL OR youtube_url IS NOT NULL THEN 20 ELSE 0 END +
      CASE WHEN is_verified = true THEN 20 ELSE 0 END
    )
  ) STORED,
  -- Audit fields
  created_by text,
  updated_by text,
  settings jsonb DEFAULT '{"hide_branding": false}'::jsonb,
  theme jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SOCIAL LINKS - creator social media links
CREATE TABLE social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  platform text NOT NULL, -- Free-form platform name (backwards compatibility)
  platform_type social_platform NOT NULL, -- Validated platform enum
  url text NOT NULL,
  display_text text, -- Optional custom display text
  sort_order integer DEFAULT 0,
  clicks integer DEFAULT 0,
  is_active boolean DEFAULT TRUE,
  -- Audit fields
  created_by text,
  updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique platform per creator profile
  UNIQUE(creator_profile_id, platform)
);

-- RELEASES - creator content releases
CREATE TABLE releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  dsp text NOT NULL, -- Digital Service Provider
  title text NOT NULL,
  url text NOT NULL,
  release_date timestamptz,
  -- Audit fields
  created_by text,
  updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TIPS - creator monetization
CREATE TABLE tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  contact_email text,
  contact_phone text,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency currency_code NOT NULL DEFAULT 'USD',
  payment_intent text UNIQUE NOT NULL, -- Stripe payment intent ID
  -- Audit fields
  created_by text,
  updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SUBSCRIPTIONS - user subscription management
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'inactive',
  -- Stripe integration fields
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  -- Legacy RevenueCat support
  revenuecat_id text,
  -- Subscription timing
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CLICK EVENTS - analytics tracking
CREATE TABLE click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  link_type link_type_enum NOT NULL,
  target text NOT NULL, -- Platform/service clicked
  ua text, -- User agent
  platform_detected text, -- Detected platform
  created_at timestamptz DEFAULT now()
);

-- ONBOARDING RATE LIMIT - anonymous rate limiting
CREATE TABLE onboarding_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  session_token text, -- Session tracking
  user_agent_hash text, -- Hashed user agent for deduplication
  attempts integer DEFAULT 1,
  last_attempt_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- =====================================
-- CONSTRAINTS AND INDEXES
-- =====================================

-- APP_USERS constraints
CREATE UNIQUE INDEX app_users_email_unique_idx ON app_users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX app_users_stripe_customer_id_unique_idx ON app_users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX app_users_stripe_subscription_id_unique_idx ON app_users(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- CREATOR_PROFILES constraints and indexes
CREATE UNIQUE INDEX creator_profiles_username_normalized_idx ON creator_profiles(username_normalized);
CREATE UNIQUE INDEX creator_profiles_spotify_id_unique_idx ON creator_profiles(spotify_id) WHERE spotify_id IS NOT NULL;
CREATE INDEX creator_profiles_user_id_idx ON creator_profiles(user_id);
CREATE INDEX creator_profiles_type_idx ON creator_profiles(creator_type);
CREATE INDEX creator_profiles_public_idx ON creator_profiles(is_public) WHERE is_public = true;
CREATE INDEX creator_profiles_featured_idx ON creator_profiles(is_featured, is_public) WHERE is_featured = true AND is_public = true;
CREATE INDEX creator_profiles_verified_idx ON creator_profiles(is_verified, is_public) WHERE is_verified = true AND is_public = true;

-- Text search indexes using trigrams
CREATE INDEX creator_profiles_display_name_trgm_idx ON creator_profiles USING gin (lower(display_name) gin_trgm_ops) WHERE is_public = true AND display_name IS NOT NULL;
CREATE INDEX creator_profiles_bio_trgm_idx ON creator_profiles USING gin (lower(bio) gin_trgm_ops) WHERE is_public = true AND bio IS NOT NULL;
CREATE INDEX creator_profiles_search_text_idx ON creator_profiles USING gin (search_text gin_trgm_ops) WHERE is_public = true;

-- Generated column indexes
CREATE INDEX creator_profiles_display_title_idx ON creator_profiles (display_title) WHERE is_public = true;
CREATE INDEX creator_profiles_completion_idx ON creator_profiles (profile_completion_pct DESC) WHERE is_public = true AND profile_completion_pct > 0;

-- SOCIAL_LINKS indexes
CREATE INDEX social_links_creator_profile_id_idx ON social_links(creator_profile_id);
CREATE INDEX social_links_platform_idx ON social_links(platform);
CREATE INDEX social_links_platform_type_idx ON social_links(platform_type, is_active) WHERE is_active = true;
CREATE INDEX social_links_active_idx ON social_links(is_active) WHERE is_active = true;
CREATE INDEX social_links_sort_order_idx ON social_links(creator_profile_id, sort_order);

-- Other table indexes
CREATE INDEX releases_creator_id_idx ON releases(creator_id);
CREATE INDEX tips_creator_id_idx ON tips(creator_id);
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX click_events_creator_id_idx ON click_events(creator_id);
CREATE INDEX click_events_link_type_idx ON click_events(link_type);
CREATE INDEX onboarding_rate_limit_ip_idx ON onboarding_rate_limit(ip_address);

-- Add check constraints
ALTER TABLE creator_profiles ADD CONSTRAINT creator_profiles_claimed_consistency 
  CHECK (is_claimed = (user_id IS NOT NULL));

ALTER TABLE app_users ADD CONSTRAINT valid_plan_values 
  CHECK (plan IS NULL OR plan IN ('pro_lite', 'pro'));

ALTER TABLE social_links ADD CONSTRAINT social_links_platform_consistency 
  CHECK (
    (platform_type = 'other'::social_platform) OR
    (lower(platform) = platform_type::text) OR
    (platform_type = 'apple_music' AND lower(platform) IN ('apple', 'apple_music')) OR
    (platform_type = 'youtube_music' AND lower(platform) IN ('youtube_music', 'ytmusic')) OR
    (platform_type = 'cashapp' AND lower(platform) IN ('cashapp', 'cash_app')) OR
    (platform_type = 'ko_fi' AND lower(platform) IN ('ko_fi', 'kofi')) OR
    (platform_type = 'x' AND lower(platform) IN ('x', 'twitter'))
  );

-- =====================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================

-- Enable RLS on all tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_rate_limit ENABLE ROW LEVEL SECURITY;

-- APP_USERS policies
CREATE POLICY "app_users_select_own" ON app_users
  FOR SELECT TO authenticated
  USING (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_insert_own" ON app_users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.jwt()->>'sub');

CREATE POLICY "app_users_update_own" ON app_users
  FOR UPDATE TO authenticated
  USING (id = auth.jwt()->>'sub')
  WITH CHECK (id = auth.jwt()->>'sub');

-- CREATOR_PROFILES policies
CREATE POLICY "creator_profiles_public_read" ON creator_profiles
  FOR SELECT TO anon
  USING (is_public = true);

CREATE POLICY "creator_profiles_auth_read" ON creator_profiles
  FOR SELECT TO authenticated
  USING (is_public = true OR user_id = auth.jwt()->>'sub');

CREATE POLICY "creator_profiles_owner_insert" ON creator_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub' OR user_id IS NULL);

CREATE POLICY "creator_profiles_owner_update" ON creator_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.jwt()->>'sub' OR user_id IS NULL)
  WITH CHECK (user_id = auth.jwt()->>'sub' OR user_id IS NULL);

CREATE POLICY "creator_profiles_owner_delete" ON creator_profiles
  FOR DELETE TO authenticated
  USING (user_id = auth.jwt()->>'sub');

-- SOCIAL_LINKS policies
CREATE POLICY "social_links_public_read" ON social_links
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = social_links.creator_profile_id 
      AND cp.is_public = true
    )
    AND is_active = true
  );

CREATE POLICY "social_links_auth_read" ON social_links
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = social_links.creator_profile_id 
      AND (cp.is_public = true OR cp.user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "social_links_owner_insert" ON social_links
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = social_links.creator_profile_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "social_links_owner_update" ON social_links
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = social_links.creator_profile_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "social_links_owner_delete" ON social_links
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = social_links.creator_profile_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

-- Other table policies (similar pattern)
CREATE POLICY "releases_public_read" ON releases
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = releases.creator_id 
      AND cp.is_public = true
    )
  );

CREATE POLICY "releases_auth_read" ON releases
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = releases.creator_id 
      AND (cp.is_public = true OR cp.user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "releases_owner_all" ON releases
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = releases.creator_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "tips_owner_all" ON tips
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = tips.creator_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "subscriptions_owner_all" ON subscriptions
  FOR ALL TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "click_events_anon_insert" ON click_events
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "click_events_owner_read" ON click_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = click_events.creator_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "onboarding_rate_limit_anon_access" ON onboarding_rate_limit
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- =====================================
-- FUNCTIONS AND TRIGGERS
-- =====================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to extract user ID from JWT for audit tracking
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    auth.jwt()->>'sub',
    current_setting('request.jwt.claims', true)::json->>'sub',
    'system'
  );
$$;

-- Audit trigger function to set created_by and updated_by
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id text;
BEGIN
  current_user_id := get_current_user_id();
  
  IF TG_OP = 'INSERT' THEN
    NEW.created_by := current_user_id;
    NEW.updated_by := current_user_id;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by := current_user_id;
    NEW.created_by := OLD.created_by;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply triggers
CREATE TRIGGER update_creator_profiles_updated_at
  BEFORE UPDATE ON creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at
  BEFORE UPDATE ON releases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tips_updated_at
  BEFORE UPDATE ON tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply audit triggers
CREATE TRIGGER creator_profiles_audit_trigger
  BEFORE INSERT OR UPDATE ON creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER social_links_audit_trigger
  BEFORE INSERT OR UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER releases_audit_trigger
  BEFORE INSERT OR UPDATE ON releases
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER tips_audit_trigger
  BEFORE INSERT OR UPDATE ON tips
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

-- =====================================
-- UTILITY FUNCTIONS
-- =====================================

-- Function to increment social link clicks
CREATE OR REPLACE FUNCTION increment_clicks(link_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE social_links 
  SET clicks = clicks + 1 
  WHERE id = link_id;
$$;

-- Anonymous function to record click events
CREATE OR REPLACE FUNCTION record_click(
  creator_username text,
  link_type_param link_type_enum,
  target text,
  ua text DEFAULT NULL,
  platform text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  creator_uuid uuid;
BEGIN
  -- Get creator ID from username
  SELECT id INTO creator_uuid
  FROM creator_profiles 
  WHERE username_normalized = lower(creator_username)
  AND is_public = true
  LIMIT 1;
  
  IF creator_uuid IS NOT NULL THEN
    INSERT INTO click_events (creator_id, link_type, target, ua, platform_detected)
    VALUES (creator_uuid, link_type_param, target, ua, platform);
  END IF;
END;
$$;

-- Anonymous rate limiting function
CREATE OR REPLACE FUNCTION check_anonymous_onboarding_rate_limit(
  ip_address_param inet,
  session_token_param text DEFAULT NULL,
  user_agent_param text DEFAULT NULL
)
RETURNS TABLE(allowed boolean, remaining_attempts integer, reset_at timestamptz, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_attempts integer := 10;
  window_minutes integer := 60;
  current_attempts integer := 0;
  last_attempt timestamptz;
  user_agent_hash_val text;
  rate_limit_key text;
BEGIN
  -- Create user agent hash if provided
  user_agent_hash_val := CASE 
    WHEN user_agent_param IS NOT NULL 
    THEN encode(digest(user_agent_param, 'sha256'), 'hex')
    ELSE NULL 
  END;
  
  -- Determine rate limit key priority: session > IP+UA > IP
  rate_limit_key := COALESCE(
    session_token_param,
    CASE WHEN user_agent_hash_val IS NOT NULL 
         THEN ip_address_param::text || ':' || user_agent_hash_val
         ELSE ip_address_param::text END
  );
  
  -- Check current attempts within window
  SELECT COALESCE(SUM(attempts), 0), MAX(last_attempt_at)
  INTO current_attempts, last_attempt
  FROM onboarding_rate_limit
  WHERE (
    (session_token_param IS NOT NULL AND session_token = session_token_param) OR
    (session_token_param IS NULL AND user_agent_hash_val IS NOT NULL AND 
     ip_address = ip_address_param AND user_agent_hash = user_agent_hash_val) OR
    (session_token_param IS NULL AND user_agent_hash_val IS NULL AND ip_address = ip_address_param)
  )
  AND last_attempt_at > now() - (window_minutes || ' minutes')::interval;
  
  -- Check if rate limit exceeded
  IF current_attempts >= max_attempts THEN
    RETURN QUERY SELECT 
      false, 
      0, 
      (last_attempt + (window_minutes || ' minutes')::interval),
      'Rate limit exceeded. Try again later.';
    RETURN;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO onboarding_rate_limit (
    ip_address, session_token, user_agent_hash, attempts, last_attempt_at
  )
  VALUES (
    ip_address_param, session_token_param, user_agent_hash_val, 1, now()
  )
  ON CONFLICT (
    COALESCE(session_token, ''), 
    COALESCE(user_agent_hash, ''), 
    ip_address
  )
  DO UPDATE SET 
    attempts = onboarding_rate_limit.attempts + 1,
    last_attempt_at = now();
  
  -- Return success
  RETURN QUERY SELECT 
    true, 
    (max_attempts - current_attempts - 1), 
    (now() + (window_minutes || ' minutes')::interval)::timestamptz,
    'Request allowed'::text;
END;
$$;

-- Function to get platform display name
CREATE OR REPLACE FUNCTION get_platform_display_name(platform_type social_platform)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE platform_type
    WHEN 'spotify' THEN 'Spotify'
    WHEN 'apple_music' THEN 'Apple Music'
    WHEN 'youtube' THEN 'YouTube'
    WHEN 'youtube_music' THEN 'YouTube Music'
    WHEN 'soundcloud' THEN 'SoundCloud'
    WHEN 'bandcamp' THEN 'Bandcamp'
    WHEN 'instagram' THEN 'Instagram'
    WHEN 'twitter' THEN 'Twitter'
    WHEN 'x' THEN 'X (Twitter)'
    WHEN 'tiktok' THEN 'TikTok'
    WHEN 'facebook' THEN 'Facebook'
    WHEN 'linkedin' THEN 'LinkedIn'
    WHEN 'twitch' THEN 'Twitch'
    WHEN 'discord' THEN 'Discord'
    WHEN 'patreon' THEN 'Patreon'
    WHEN 'venmo' THEN 'Venmo'
    WHEN 'paypal' THEN 'PayPal'
    WHEN 'cashapp' THEN 'Cash App'
    WHEN 'ko_fi' THEN 'Ko-fi'
    WHEN 'buymeacoffee' THEN 'Buy Me a Coffee'
    WHEN 'linktree' THEN 'Linktree'
    WHEN 'website' THEN 'Website'
    WHEN 'email' THEN 'Email'
    WHEN 'phone' THEN 'Phone'
    ELSE initcap(replace(platform_type::text, '_', ' '))
  END;
$$;

-- =====================================
-- GRANTS AND PERMISSIONS
-- =====================================

-- Grant table access
GRANT SELECT ON creator_profiles TO anon;
GRANT SELECT ON social_links TO anon;
GRANT SELECT ON releases TO anon;
GRANT INSERT ON click_events TO anon;
GRANT SELECT, INSERT, UPDATE ON onboarding_rate_limit TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant function access
GRANT EXECUTE ON FUNCTION record_click(text, link_type_enum, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION check_anonymous_onboarding_rate_limit(inet, text, text) TO anon;
GRANT EXECUTE ON FUNCTION increment_clicks(uuid) TO anon;
GRANT EXECUTE ON FUNCTION get_platform_display_name(social_platform) TO anon;

-- =====================================
-- SEED DATA
-- =====================================

INSERT INTO app_users (id, email) VALUES 
  ('test_user_1', 'test1@example.com'),
  ('test_user_2', 'test2@example.com'),
  ('artist_1', 'ladygaga@example.com'),
  ('artist_5', 'tim@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO creator_profiles (user_id, creator_type, username, display_name, bio, avatar_url, spotify_url, spotify_id, is_public, is_featured) VALUES
  ('test_user_1', 'artist', 'testartist1', 'Test Artist One', 'This is a test public artist profile.', null, null, null, true, false),
  ('test_user_2', 'artist', 'testartist2', 'Test Artist Two', 'This is a test private artist profile.', null, null, null, false, false),
  ('artist_1', 'artist', 'ladygaga', 'Lady Gaga', 'Grammy Award-winning artist known for hits like "Bad Romance" and "Shallow". Advocate for mental health awareness and LGBTQ+ rights.', 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd', 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms', '1HY2Jd0NmPuamShAr6KMms', true, true),
  ('artist_5', 'artist', 'tim', 'Tim White', 'Independent artist exploring electronic and ambient sounds. Latest release: "Never Say A Word" (2024).', 'https://i.scdn.co/image/ab6761610000e5ebbab7ca6e76db7da72b58aa5c', null, null, true, false)
ON CONFLICT (username_normalized) DO NOTHING;

-- Update table statistics
ANALYZE app_users;
ANALYZE creator_profiles;
ANALYZE social_links;
ANALYZE releases;
ANALYZE tips;
ANALYZE subscriptions;
ANALYZE click_events;
ANALYZE onboarding_rate_limit;

-- =====================================
-- SCHEMA COMMENTS
-- =====================================

COMMENT ON TYPE social_platform IS 'Validated social and creator platform types';
COMMENT ON COLUMN creator_profiles.username_normalized IS 'Auto-generated lowercase username for consistent lookups';
COMMENT ON COLUMN creator_profiles.search_text IS 'Auto-generated searchable text combining display_name, bio, and username';
COMMENT ON COLUMN creator_profiles.display_title IS 'Auto-generated display name fallback to username';
COMMENT ON COLUMN creator_profiles.profile_completion_pct IS 'Auto-calculated profile completion percentage (0-100)';
COMMENT ON COLUMN creator_profiles.created_by IS 'User ID who created this record (from JWT)';
COMMENT ON COLUMN creator_profiles.updated_by IS 'User ID who last updated this record (from JWT)';
COMMENT ON FUNCTION get_platform_display_name(social_platform) IS 'Returns human-readable platform name for UI display';