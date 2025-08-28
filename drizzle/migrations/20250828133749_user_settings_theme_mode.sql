-- Migration: Add theme_mode enum and user_settings table
-- Created at: 2025-08-28 13:37:49 -0700

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'theme_mode'
  ) THEN
    CREATE TYPE theme_mode AS ENUM ('system', 'light', 'dark');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme_mode theme_mode NOT NULL DEFAULT 'system',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional: ensure existing users get a row lazily via upsert in app logic.
