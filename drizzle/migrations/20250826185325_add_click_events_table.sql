-- Add click_events table
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES social_links(id) ON DELETE SET NULL,
  link_type link_type NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  os TEXT,
  browser TEXT,
  is_bot BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add index for faster lookups by creator and date
CREATE INDEX IF NOT EXISTS idx_click_events_creator_created ON click_events(creator_profile_id, created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_link_type ON click_events(link_type);
