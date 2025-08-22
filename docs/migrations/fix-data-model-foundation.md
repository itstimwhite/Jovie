# Data Model Foundation – Migration Plan

Owner: @itstimwhite
Scope: #375 (query optimization) + audit items (usernames, clicks, claim flow, RLS)

## Goals

- Unify username uniqueness and reduce false negatives.
- Enable anonymous click ingestion safely for public analytics.
- Harden claim flow using SECURITY DEFINER functions.
- Remove brittle RLS depending on current_setting.
- Add key indexes and update TS types/tests.

## Migrations (idempotent)

1. Username uniqueness

- creator_profiles: unique index on lower(username).
- Drop/adjust conflicting regex/unique constraints.

2. Click ingestion

- SECURITY DEFINER function: insert into click_events with validation (creator exists, public profile, signed/optional rate-limit).
- Index: click_events (creator_id, created_at).

3. Claim flow hardening

- SECURITY DEFINER function to transition unclaimed → claimed; move updates behind function.
- Remove broad UPDATE RLS for unclaimed; keep read-only where needed.

4. RLS cleanup

- Remove policies relying on current_setting HTTP vars.
- Prefer auth context + function gating.

5. Performance indexes

- creator_profiles: (is_public, username) partials as needed.
- app_users: email (lower) partial unique if enabled; optional spotify_id unique.

## TypeScript alignment

- Update `types/db.ts` for renamed fields/constraints and new functions.
- Adjust `types/common.ts` interfaces if needed.

## Tests

- Integration: username uniqueness (case-insensitive), click ingestion anon path.
- E2E (follow-ups): onboarding handle claim edge cases.

## Rollout

- Deploy migrations to Preview.
- Verify with E2E/Integration tests in CI.
- Backfill if required (no-op expected).

## Risk & Rollback

- Low data risk; primarily indexes + functions + policy changes.
- Rollback by dropping new indexes/functions and restoring prior policies.
