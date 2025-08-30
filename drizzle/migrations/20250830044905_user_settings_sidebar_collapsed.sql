-- Add sidebar_collapsed preference to user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS sidebar_collapsed boolean NOT NULL DEFAULT false;

-- Backfill not needed due to default; ensure updated_at touched on change is handled at application layer.
