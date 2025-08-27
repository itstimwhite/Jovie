-- Fix click_events table column name
ALTER TABLE click_events RENAME COLUMN is_bool TO is_bot;

-- Add missing enums that are defined in schema but not in the initial migration
CREATE TYPE "public"."subscription_plan" AS ENUM('free', 'basic', 'premium', 'pro');
CREATE TYPE "public"."subscription_status" AS ENUM(
  'active', 'inactive', 'cancelled', 'past_due', 
  'trialing', 'incomplete', 'incomplete_expired', 'unpaid'
);
CREATE TYPE "public"."currency_code" AS ENUM(
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
);

-- Ensure click_events table uses the proper link_type enum
DROP TABLE IF EXISTS click_events;
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    link_id UUID REFERENCES social_links(id) ON DELETE SET NULL,
    link_type "link_type" NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    os TEXT,
    browser TEXT,
    is_bot BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_click_events_creator_profile_id ON click_events(creator_profile_id);
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events(created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_link_type ON click_events(link_type);

-- Ensure creator_profiles has default jsonb values
UPDATE creator_profiles SET settings = '{}'::jsonb WHERE settings IS NULL;
UPDATE creator_profiles SET theme = '{}'::jsonb WHERE theme IS NULL;

-- Add any missing constraints for data integrity
ALTER TABLE creator_profiles 
  ALTER COLUMN settings SET DEFAULT '{}'::jsonb,
  ALTER COLUMN theme SET DEFAULT '{}'::jsonb;