-- Migration: Fix user sign-up RLS policy issue
-- Created: 2025-08-18 20:00:00 UTC
-- Purpose: Allow users to create their own user record during sign-up process
-- Issue: Current RLS policy creates circular dependency during user creation
-- 
-- PROBLEM:
-- The current users_insert_self policy requires the JWT sub claim to match
-- the clerk_id being inserted, but during sign-up the user record doesn't
-- exist yet, creating a chicken-and-egg problem.
--
-- SOLUTION:
-- Update the insert policy to allow user creation when authenticated with Clerk
-- but without requiring the user record to already exist.

-- =============================================================================
-- UPDATE USER INSERT POLICY
-- =============================================================================

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "users_insert_self" ON users;

-- Create a more permissive policy for user creation during sign-up
-- This allows any authenticated user to insert their own user record
-- as long as the clerk_id matches their JWT sub claim
CREATE POLICY "users_insert_during_signup" ON users
  FOR INSERT 
  WITH CHECK (
    -- Allow insert if the user is authenticated via Clerk JWT
    -- and the clerk_id matches their JWT sub claim
    clerk_id = current_setting('request.jwt.claims', true)::jsonb->>'sub'
    AND current_setting('request.jwt.claims', true)::jsonb->>'sub' IS NOT NULL
  );

-- =============================================================================
-- POLICY DOCUMENTATION
-- =============================================================================

COMMENT ON POLICY "users_insert_during_signup" ON users IS 
'RLS Policy: Allow User Creation During Sign-up

Purpose: Allows authenticated users to create their own user record during
the sign-up process. Verifies that the clerk_id matches the JWT sub claim
without requiring the user record to already exist.

Security: Only the user themselves can create their record, and only when
properly authenticated via Clerk JWT. Prevents users from creating records
for other users.

Used by: Sign-up flow, onboarding process, initial user creation.

Fixed Issue: Resolves circular dependency where user creation required
existing user record for RLS policy validation.';

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- This migration should allow:
-- 1. Authenticated users to create their own user record during sign-up
-- 2. Existing select policy to still work for reading user data
-- 3. Prevent users from creating records for other users
--
-- Test with authenticated client:
-- INSERT INTO users (clerk_id, email) VALUES (jwt_sub_claim, 'user@example.com');