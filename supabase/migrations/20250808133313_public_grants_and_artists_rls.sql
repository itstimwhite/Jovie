-- Migration: public grants and RLS policy for artists (published)
-- Description: Ensure anon/authenticated can read published artists and can use public schema.
-- Note: Uses DROP POLICY IF EXISTS for idempotence when re-running locally.

-- Schema visibility and read privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Future tables default privileges (adjust to your security posture as needed)
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

-- RLS for artists: only allow reading rows where published is true
ALTER TABLE IF EXISTS public.artists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published artists" ON public.artists;
CREATE POLICY "Public can read published artists"
  ON public.artists
  FOR SELECT
  TO anon, authenticated
  USING (published IS TRUE);
