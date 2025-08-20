-- Add billing fields to app_users table
-- This migration adds Stripe-related fields for billing functionality

-- Add billing columns to app_users table
ALTER TABLE app_users 
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS billing_updated_at TIMESTAMPTZ DEFAULT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_app_users_stripe_customer_id ON app_users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_app_users_stripe_subscription_id ON app_users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_app_users_is_pro ON app_users(is_pro);
CREATE INDEX IF NOT EXISTS idx_app_users_plan ON app_users(plan);

-- Add unique constraint on stripe_customer_id to prevent duplicates
ALTER TABLE app_users 
ADD CONSTRAINT unique_stripe_customer_id 
UNIQUE (stripe_customer_id);

-- Add unique constraint on stripe_subscription_id to prevent duplicates
ALTER TABLE app_users 
ADD CONSTRAINT unique_stripe_subscription_id 
UNIQUE (stripe_subscription_id);

-- Add check constraint for valid plan values
ALTER TABLE app_users 
ADD CONSTRAINT valid_plan_values 
CHECK (plan IS NULL OR plan IN ('pro_lite', 'pro'));

-- Update RLS policies to include billing fields
-- Users can read their own billing information
DROP POLICY IF EXISTS "Users can view their own billing data" ON app_users;
CREATE POLICY "Users can view their own billing data" ON app_users
  FOR SELECT USING (auth.jwt() ->> 'sub' = id);

-- Users can update their own billing information (for webhook updates)
DROP POLICY IF EXISTS "Users can update their own billing data" ON app_users;
CREATE POLICY "Users can update their own billing data" ON app_users
  FOR UPDATE USING (auth.jwt() ->> 'sub' = id);

-- Add comment explaining the billing fields
COMMENT ON COLUMN app_users.is_pro IS 'True if user has any active pro subscription';
COMMENT ON COLUMN app_users.plan IS 'Current plan: pro_lite ($5/$25 intro) or pro ($12/$48 standard)';
COMMENT ON COLUMN app_users.stripe_customer_id IS 'Stripe Customer ID for billing';
COMMENT ON COLUMN app_users.stripe_subscription_id IS 'Active Stripe Subscription ID';
COMMENT ON COLUMN app_users.billing_updated_at IS 'Last time billing fields were updated via webhook';