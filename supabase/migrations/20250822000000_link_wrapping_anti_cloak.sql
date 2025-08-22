-- Link Wrapping System with Anti-Cloaking Protection
-- Migration: 20250822000000_link_wrapping_anti_cloak.sql

-- Create encryption key management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wrapped_links table for link management
CREATE TABLE wrapped_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id VARCHAR(12) UNIQUE NOT NULL,
  encrypted_url TEXT NOT NULL,
  kind VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (kind IN ('normal', 'sensitive')),
  domain VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  title_alias VARCHAR(255), -- Generic title for crawlers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- For temporary links
  click_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Indexes for performance
  INDEX wrapped_links_short_id_idx ON wrapped_links(short_id),
  INDEX wrapped_links_domain_idx ON wrapped_links(domain),
  INDEX wrapped_links_kind_idx ON wrapped_links(kind),
  INDEX wrapped_links_created_by_idx ON wrapped_links(created_by)
);

-- Create sensitive domain categories table
CREATE TABLE sensitive_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  alias VARCHAR(100) NOT NULL, -- Generic alias for crawlers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX sensitive_domains_domain_idx ON sensitive_domains(domain),
  INDEX sensitive_domains_category_idx ON sensitive_domains(category)
);

-- Create signed URLs table for temporary access
CREATE TABLE signed_link_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES wrapped_links(id) ON DELETE CASCADE,
  signed_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX signed_link_access_token_idx ON signed_link_access(signed_token),
  INDEX signed_link_access_link_id_idx ON signed_link_access(link_id),
  INDEX signed_link_access_expires_idx ON signed_link_access(expires_at)
);

-- Create rate limiting table
CREATE TABLE link_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(ip_address, endpoint, window_start)
);

-- Create bot detection log table
CREATE TABLE bot_detection_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET,
  user_agent TEXT,
  asn INTEGER,
  blocked_reason VARCHAR(100),
  endpoint VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX bot_detection_log_ip_idx ON bot_detection_log(ip_address),
  INDEX bot_detection_log_asn_idx ON bot_detection_log(asn),
  INDEX bot_detection_log_created_idx ON bot_detection_log(created_at)
);

-- Enable RLS
ALTER TABLE wrapped_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensitive_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE signed_link_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_detection_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wrapped_links
CREATE POLICY "Users can read all wrapped links" ON wrapped_links
  FOR SELECT USING (true);

CREATE POLICY "Users can create wrapped links" ON wrapped_links
  FOR INSERT WITH CHECK (auth.jwt()->>'sub' = created_by::text OR created_by IS NULL);

CREATE POLICY "Users can update their own wrapped links" ON wrapped_links
  FOR UPDATE USING (auth.jwt()->>'sub' = created_by::text OR created_by IS NULL);

-- RLS Policies for sensitive_domains (read-only for most operations)
CREATE POLICY "Anyone can read sensitive domains" ON sensitive_domains
  FOR SELECT USING (true);

-- RLS Policies for signed_link_access (service usage)
CREATE POLICY "Service can manage signed access" ON signed_link_access
  FOR ALL USING (true);

-- RLS Policies for rate limiting (service usage)
CREATE POLICY "Service can manage rate limits" ON link_rate_limits
  FOR ALL USING (true);

-- RLS Policies for bot detection (service usage)
CREATE POLICY "Service can log bot detection" ON bot_detection_log
  FOR ALL USING (true);

-- Seed sensitive domains with generic aliases
INSERT INTO sensitive_domains (domain, category, alias) VALUES
  -- Adult Content
  ('onlyfans.com', 'adult', 'Premium Content'),
  ('fansly.com', 'adult', 'Exclusive Content'),
  ('pornhub.com', 'adult', 'Adult Entertainment'),
  ('xvideos.com', 'adult', 'Adult Entertainment'),
  ('xhamster.com', 'adult', 'Adult Entertainment'),
  ('redtube.com', 'adult', 'Adult Entertainment'),
  ('chaturbate.com', 'adult', 'Live Streaming'),
  ('cam4.com', 'adult', 'Live Streaming'),
  ('stripchat.com', 'adult', 'Live Streaming'),
  ('myfreecams.com', 'adult', 'Live Streaming'),
  
  -- Gambling
  ('draftkings.com', 'gambling', 'Sports Entertainment'),
  ('fanduel.com', 'gambling', 'Sports Entertainment'),
  ('betmgm.com', 'gambling', 'Gaming Platform'),
  ('caesars.com', 'gambling', 'Entertainment'),
  ('bet365.com', 'gambling', 'Sports Platform'),
  ('pokerstars.com', 'gambling', 'Card Games'),
  ('888casino.com', 'gambling', 'Gaming Platform'),
  ('bovada.lv', 'gambling', 'Sports Platform'),
  
  -- Crypto/Trading (high volatility)
  ('coinbase.com', 'crypto', 'Digital Assets'),
  ('binance.com', 'crypto', 'Trading Platform'),
  ('crypto.com', 'crypto', 'Digital Finance'),
  ('robinhood.com', 'trading', 'Investment Platform'),
  ('webull.com', 'trading', 'Investment Platform'),
  
  -- Dating (can be sensitive)
  ('tinder.com', 'dating', 'Social Platform'),
  ('bumble.com', 'dating', 'Social Network'),
  ('seeking.com', 'dating', 'Premium Dating'),
  ('adultfriendfinder.com', 'dating', 'Social Platform'),
  
  -- Payday/High-Interest Lending
  ('cashadvance.com', 'lending', 'Financial Services'),
  ('paydayloan.com', 'lending', 'Financial Services'),
  ('quickcash.com', 'lending', 'Financial Services');

-- Create function to generate short IDs
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  short_id VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    short_id := short_id || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM wrapped_links WHERE wrapped_links.short_id = generate_short_id.short_id) LOOP
    short_id := '';
    FOR i IN 1..12 LOOP
      short_id := short_id || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
  END LOOP;
  
  RETURN short_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to encrypt URLs (simplified - use proper encryption in production)
CREATE OR REPLACE FUNCTION encrypt_url(url TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Simple base64 encoding for demo - use pgcrypto in production
  RETURN encode(url::bytea, 'base64');
END;
$$ LANGUAGE plpgsql;

-- Create function to decrypt URLs
CREATE OR REPLACE FUNCTION decrypt_url(encrypted_url TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Simple base64 decoding for demo - use pgcrypto in production
  RETURN convert_from(decode(encrypted_url, 'base64'), 'UTF8');
END;
$$ LANGUAGE plpgsql;

-- Create function to categorize domain
CREATE OR REPLACE FUNCTION categorize_domain(url TEXT)
RETURNS TABLE(category VARCHAR(50), alias VARCHAR(100), kind VARCHAR(20)) AS $$
DECLARE
  domain_name TEXT;
  sensitive_record RECORD;
BEGIN
  -- Extract domain from URL
  domain_name := lower(regexp_replace(url, '^https?://(www\.)?([^/]+).*', '\2'));
  
  -- Check if domain is in sensitive list
  SELECT sd.category, sd.alias INTO sensitive_record
  FROM sensitive_domains sd
  WHERE sd.domain = domain_name;
  
  IF FOUND THEN
    RETURN QUERY SELECT sensitive_record.category, sensitive_record.alias, 'sensitive'::VARCHAR(20);
  ELSE
    RETURN QUERY SELECT NULL::VARCHAR(50), NULL::VARCHAR(100), 'normal'::VARCHAR(20);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wrapped_links_updated_at
  BEFORE UPDATE ON wrapped_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create cleanup function for expired links
CREATE OR REPLACE FUNCTION cleanup_expired_links()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM signed_link_access WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM wrapped_links WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON wrapped_links TO authenticated;
GRANT ALL ON sensitive_domains TO authenticated;
GRANT ALL ON signed_link_access TO authenticated;
GRANT ALL ON link_rate_limits TO authenticated;
GRANT ALL ON bot_detection_log TO authenticated;

GRANT EXECUTE ON FUNCTION generate_short_id() TO authenticated;
GRANT EXECUTE ON FUNCTION encrypt_url(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrypt_url(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION categorize_domain(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_links() TO authenticated;