-- =====================================
-- LINK WRAPPING AND ANTI-SCRAPE MIGRATION
-- =====================================
-- Implements tiered link wrapping with anti-scrape protections

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum for link kinds
CREATE TYPE link_kind AS ENUM ('normal', 'sensitive');

-- WRAPPED LINKS table for link redirection
CREATE TABLE wrapped_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  kind link_kind NOT NULL DEFAULT 'normal',
  -- Encrypted URL storage (sensitive domains protected)
  encrypted_url text NOT NULL,
  original_domain text NOT NULL, -- For categorization and analytics
  -- Metadata for analytics and security
  clicks integer DEFAULT 0,
  last_clicked_at timestamptz,
  -- Security fields
  signed_token_secret text DEFAULT gen_random_uuid()::text, -- For temporary signed URLs
  -- Audit fields
  created_by text,
  updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SENSITIVE DOMAINS lookup table for categorization
CREATE TABLE sensitive_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  category text NOT NULL, -- 'adult', 'gambling', 'crypto', etc.
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX wrapped_links_creator_profile_id_idx ON wrapped_links(creator_profile_id);
CREATE INDEX wrapped_links_kind_idx ON wrapped_links(kind);
CREATE INDEX wrapped_links_domain_idx ON wrapped_links(original_domain);
CREATE INDEX wrapped_links_clicks_idx ON wrapped_links(clicks DESC);
CREATE INDEX sensitive_domains_domain_idx ON sensitive_domains(domain);
CREATE INDEX sensitive_domains_category_idx ON sensitive_domains(category);

-- Enable RLS on new tables
ALTER TABLE wrapped_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensitive_domains ENABLE ROW LEVEL SECURITY;

-- RLS policies for wrapped_links
CREATE POLICY "wrapped_links_public_read" ON wrapped_links
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = wrapped_links.creator_profile_id 
      AND cp.is_public = true
    )
  );

CREATE POLICY "wrapped_links_auth_read" ON wrapped_links
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = wrapped_links.creator_profile_id 
      AND (cp.is_public = true OR cp.user_id = auth.jwt()->>'sub')
    )
  );

CREATE POLICY "wrapped_links_owner_all" ON wrapped_links
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creator_profiles cp 
      WHERE cp.id = wrapped_links.creator_profile_id 
      AND cp.user_id = auth.jwt()->>'sub'
    )
  );

-- RLS policies for sensitive_domains (admin-managed)
CREATE POLICY "sensitive_domains_public_read" ON sensitive_domains
  FOR SELECT TO anon, authenticated
  USING (true);

-- Function to encrypt URLs at rest
CREATE OR REPLACE FUNCTION encrypt_url(url_text text, secret_key text DEFAULT 'jovie_link_encryption_key')
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT encode(
    pgp_sym_encrypt(url_text, secret_key),
    'base64'
  );
$$;

-- Function to decrypt URLs
CREATE OR REPLACE FUNCTION decrypt_url(encrypted_text text, secret_key text DEFAULT 'jovie_link_encryption_key')
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT pgp_sym_decrypt(
    decode(encrypted_text, 'base64'),
    secret_key
  );
$$;

-- Function to extract domain from URL
CREATE OR REPLACE FUNCTION extract_domain(url text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  domain_part text;
BEGIN
  -- Remove protocol
  url := regexp_replace(url, '^https?://', '', 'i');
  -- Remove www. prefix
  url := regexp_replace(url, '^www\.', '', 'i');
  -- Extract domain (everything before first slash or query)
  domain_part := split_part(split_part(url, '/', 1), '?', 1);
  -- Remove port if present
  domain_part := split_part(domain_part, ':', 1);
  
  RETURN lower(domain_part);
END;
$$;

-- Function to categorize domain as sensitive
CREATE OR REPLACE FUNCTION is_sensitive_domain(domain text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM sensitive_domains 
    WHERE sensitive_domains.domain = lower(domain)
  );
$$;

-- Function to create wrapped link
CREATE OR REPLACE FUNCTION create_wrapped_link(
  creator_id uuid,
  target_url text,
  force_kind link_kind DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  link_id uuid;
  domain_name text;
  link_kind_value link_kind;
BEGIN
  -- Extract domain from URL
  domain_name := extract_domain(target_url);
  
  -- Determine kind (force override or auto-detect)
  IF force_kind IS NOT NULL THEN
    link_kind_value := force_kind;
  ELSIF is_sensitive_domain(domain_name) THEN
    link_kind_value := 'sensitive';
  ELSE
    link_kind_value := 'normal';
  END IF;
  
  -- Create wrapped link
  INSERT INTO wrapped_links (
    creator_profile_id, 
    kind, 
    encrypted_url, 
    original_domain
  )
  VALUES (
    creator_id,
    link_kind_value,
    encrypt_url(target_url),
    domain_name
  )
  RETURNING id INTO link_id;
  
  RETURN link_id;
END;
$$;

-- Function to get wrapped link with decryption (for redirects)
CREATE OR REPLACE FUNCTION get_wrapped_link_url(link_id uuid)
RETURNS TABLE(
  url text, 
  kind link_kind, 
  domain text,
  creator_username text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    decrypt_url(wl.encrypted_url) as url,
    wl.kind,
    wl.original_domain as domain,
    cp.username as creator_username
  FROM wrapped_links wl
  JOIN creator_profiles cp ON cp.id = wl.creator_profile_id
  WHERE wl.id = link_id
  AND cp.is_public = true;
END;
$$;

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_wrapped_link_clicks(link_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE wrapped_links 
  SET 
    clicks = clicks + 1,
    last_clicked_at = now()
  WHERE id = link_id;
$$;

-- Function to generate signed URL for sensitive links
CREATE OR REPLACE FUNCTION generate_signed_url(
  link_id uuid,
  expiry_seconds integer DEFAULT 60
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  secret text;
  payload text;
  signature text;
  expiry_timestamp bigint;
BEGIN
  -- Get the secret for this link
  SELECT signed_token_secret INTO secret
  FROM wrapped_links
  WHERE id = link_id;
  
  IF secret IS NULL THEN
    RAISE EXCEPTION 'Link not found';
  END IF;
  
  -- Calculate expiry timestamp
  expiry_timestamp := extract(epoch from now() + (expiry_seconds || ' seconds')::interval);
  
  -- Create payload
  payload := link_id::text || '|' || expiry_timestamp::text;
  
  -- Create signature
  signature := encode(
    hmac(payload, secret, 'sha256'),
    'base64'
  );
  
  -- Return signed token
  RETURN payload || '|' || signature;
END;
$$;

-- Function to verify signed URL
CREATE OR REPLACE FUNCTION verify_signed_url(signed_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  parts text[];
  link_id uuid;
  expiry_timestamp bigint;
  signature text;
  expected_signature text;
  secret text;
  payload text;
BEGIN
  -- Split the token
  parts := string_to_array(signed_token, '|');
  
  IF array_length(parts, 1) != 3 THEN
    RAISE EXCEPTION 'Invalid token format';
  END IF;
  
  link_id := parts[1]::uuid;
  expiry_timestamp := parts[2]::bigint;
  signature := parts[3];
  
  -- Check expiry
  IF expiry_timestamp < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token expired';
  END IF;
  
  -- Get secret
  SELECT signed_token_secret INTO secret
  FROM wrapped_links
  WHERE id = link_id;
  
  IF secret IS NULL THEN
    RAISE EXCEPTION 'Link not found';
  END IF;
  
  -- Verify signature
  payload := parts[1] || '|' || parts[2];
  expected_signature := encode(
    hmac(payload, secret, 'sha256'),
    'base64'
  );
  
  IF signature != expected_signature THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  RETURN link_id;
END;
$$;

-- Apply triggers for audit fields
CREATE TRIGGER wrapped_links_audit_trigger
  BEFORE INSERT OR UPDATE ON wrapped_links
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER wrapped_links_updated_at_trigger
  BEFORE UPDATE ON wrapped_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON wrapped_links TO anon;
GRANT SELECT ON sensitive_domains TO anon;
GRANT EXECUTE ON FUNCTION get_wrapped_link_url(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_wrapped_link_clicks(uuid) TO anon;
GRANT EXECUTE ON FUNCTION generate_signed_url(uuid, integer) TO anon;
GRANT EXECUTE ON FUNCTION verify_signed_url(text) TO anon;
GRANT EXECUTE ON FUNCTION is_sensitive_domain(text) TO anon;
GRANT EXECUTE ON FUNCTION extract_domain(text) TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON wrapped_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sensitive_domains TO authenticated;
GRANT EXECUTE ON FUNCTION create_wrapped_link(uuid, text, link_kind) TO authenticated;

-- Seed sensitive domains
INSERT INTO sensitive_domains (domain, category, notes) VALUES
  ('onlyfans.com', 'adult', 'Adult content platform'),
  ('fansly.com', 'adult', 'Adult content platform'),
  ('pornhub.com', 'adult', 'Adult content platform'),
  ('xvideos.com', 'adult', 'Adult content platform'),
  ('xhamster.com', 'adult', 'Adult content platform'),
  ('redtube.com', 'adult', 'Adult content platform'),
  ('youjizz.com', 'adult', 'Adult content platform'),
  ('tube8.com', 'adult', 'Adult content platform'),
  ('spankbang.com', 'adult', 'Adult content platform'),
  ('drtuber.com', 'adult', 'Adult content platform'),
  ('bet365.com', 'gambling', 'Online gambling'),
  ('draftkings.com', 'gambling', 'Sports betting'),
  ('fanduel.com', 'gambling', 'Sports betting'),
  ('pokerstars.com', 'gambling', 'Online poker'),
  ('888casino.com', 'gambling', 'Online casino'),
  ('binance.com', 'crypto', 'Cryptocurrency exchange'),
  ('coinbase.com', 'crypto', 'Cryptocurrency exchange'),
  ('crypto.com', 'crypto', 'Cryptocurrency platform'),
  ('kraken.com', 'crypto', 'Cryptocurrency exchange'),
  ('bitfinex.com', 'crypto', 'Cryptocurrency exchange')
ON CONFLICT (domain) DO NOTHING;

-- Update table statistics
ANALYZE wrapped_links;
ANALYZE sensitive_domains;

-- Schema comments
COMMENT ON TABLE wrapped_links IS 'Link wrapping system for external URL redirection with anti-scrape protection';
COMMENT ON COLUMN wrapped_links.encrypted_url IS 'AES encrypted target URL to protect from exposure in HTML/JSON';
COMMENT ON COLUMN wrapped_links.kind IS 'Link classification: normal (direct redirect) or sensitive (interstitial)';
COMMENT ON COLUMN wrapped_links.signed_token_secret IS 'Unique secret for generating temporary signed URLs for sensitive links';
COMMENT ON TABLE sensitive_domains IS 'Domain categorization for automatic sensitive link detection';
COMMENT ON FUNCTION create_wrapped_link(uuid, text, link_kind) IS 'Creates wrapped link with automatic domain categorization';
COMMENT ON FUNCTION generate_signed_url(uuid, integer) IS 'Generates time-limited signed URL for sensitive link access';