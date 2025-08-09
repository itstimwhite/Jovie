# Jovie MVP Plan (Windsurf)

## MVP Acceptance Criteria

- [ ] Artist profiles render at `/<handle>` locally with seeded data and no hydration/client errors.
- [ ] User sign-up via Clerk redirects to `/dashboard` and loads dashboard data successfully.
- [ ] Debug banner shows no red errors and env vars pass validation.
- [ ] No console errors/warnings on `/`, any artist page, `/dashboard`, and `/pricing`.
- [ ] `/pricing` displays Clerk billing table with correct plan info; subscribe/manage buttons work.

## Section 1: Diagnosis

- Audit current routes, especially the root-level dynamic `app/[handle]/page.tsx` for artist profiles.
- Identify current sources of browser console errors/warnings and Debug Banner red statuses.
- Check Clerk, Supabase, and billing integration health in local dev.
- Verify seeded artist data exists and is queryable locally (RLS/permissions OK).

## Section 2: Step-by-Step Fix Plan

1. Environment variable cleanup & validation

- Ensure these are set in `.env.local`:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - (Optional) NEXT_PUBLIC_CLERK_BILLING_ENABLED, NEXT_PUBLIC_CLERK_BILLING_GATEWAY
- Introduce a single source of truth `lib/env.ts` using Zod to validate and export typed env vars. Import from this file instead of reading `process.env` throughout the app. This will eliminate noisy runtime checks and reduce Debug Banner noise in dev.
- Add safe runtime checks in UI where truly necessary (DebugBanner remains a viewer, not validator).

2. Fix `[handle]` artist profile rendering (SSR/SSG) for local dev

- Confirm `app/[handle]/page.tsx` queries published artists and returns `notFound()` otherwise.
- Seed at least one published artist with social links for local dev.
- Verify RLS/permissions allow public read of `artists` and `social_links`.
- Eliminate client/hydration errors on profile pages.

3. Implement/fix sign-up redirect & dashboard data loading

- Verify Clerk sign-up flow works and redirects new users to `/dashboard`.
- Ensure `/dashboard/page.tsx` loads required user data without errors.

4. Resolve Debug Banner issues

- Remove console warnings from Supabase clients by avoiding multiple GoTrueClient instances.
- Ensure Debug Banner shows no red errors, and environment detection is correct.

5. Clean all console errors/warnings across key routes

- `/` (marketing), any artist page `/<handle>`, `/dashboard`, and `/pricing`.

6. Implement proper Clerk billing table on `/pricing`

- Ensure plan info displays correctly and subscribe/manage buttons work.

## Section 3: Execution Checklist

- [ ] Validate `.env.local` and add missing keys.
- [ ] Implement Zod-based env validation in `lib/env.ts` and refactor consumers to use it.
- [ ] Seed local Supabase with at least one published artist + social links.
- [ ] Verify RLS/permissions for public read on `artists`, `social_links`.
- [ ] Fix profile pages rendering locally without hydration errors.
- [ ] Fix Supabase client duplication warning in `DebugBanner.tsx` (storageKey + persistSession).
- [ ] Verify sign-up → `/dashboard` redirect and dashboard data load.
- [ ] Confirm Debug Banner shows no red errors in local dev.
- [ ] Clean console across `/`, `/<handle>`, `/dashboard`, `/pricing`.
- [ ] Implement/verify Clerk billing table functionality on `/pricing`.
- [ ] Final QA: click through all routes; no console errors; pricing/billing works.

## Section 4: Follow-ups (Optional, Not Blocking MVP)

- Continue removal of legacy waitlist code and flags if anything remains.
- Document Supabase grants/RLS for local dev onboarding.
- Track any code debt or refactors discovered during MVP fixes.
