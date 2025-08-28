-- Ensure uniqueness for usernames and single profile per user
-- Using unique indexes for idempotency across environments

CREATE UNIQUE INDEX IF NOT EXISTS creator_profiles_username_normalized_unique_idx
  ON creator_profiles (username_normalized);

CREATE UNIQUE INDEX IF NOT EXISTS creator_profiles_user_id_unique_idx
  ON creator_profiles (user_id);
