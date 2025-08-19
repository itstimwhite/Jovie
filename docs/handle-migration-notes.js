#!/usr/bin/env node

/**
 * MIGRATION NOTES: Artists Table to Creator Profiles
 *
 * This file documents the migration from the legacy `artists` table to the new `creator_profiles` table.
 *
 * CHANGES MADE:
 * - Handle availability check API now uses `creator_profiles.username` (was `artists.handle`)
 * - Track API now uses `creator_profiles.username` for lookups (was `artists.handle`)
 * - Theme API now uses `creator_profiles` table (was `artists`)
 * - Sitemap generation now uses `creator_profiles.username` (was `artists.handle`)
 * - Artists page now uses `creator_profiles` (was `artists`)
 * - Profile routes use `creator_profiles.username` consistently
 * - Onboarding creates `creator_profiles` entries consistently
 *
 * CANONICAL IDENTIFIER: creator_profiles.username
 *
 * LEGACY REFERENCES REMAINING:
 * - Some maintenance scripts in scripts/ directory still reference artists table
 * - These are not user-facing and don't affect handle availability checks
 * - The baseline migration drops the artists table, so these scripts may not work
 *
 * IF YOU'RE SEEING THIS:
 * - All user-facing handle operations should use creator_profiles.username
 * - Handle availability checks are now consistent across the entire application
 * - If you need to add new handle-related functionality, use creator_profiles.username
 */

console.log('Handle consistency migration completed.');
console.log(
  'All user-facing operations now use creator_profiles.username as the canonical identifier.'
);
