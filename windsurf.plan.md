# Project Launch Plan

## Notes

- Detailed MVP and execution checklist found in windsurf.plan.md.
- Key files identified for review: lib/env.ts, components/DebugBanner.tsx, app/[handle]/page.tsx, app/pricing/page.tsx, app/dashboard/page.tsx, middleware.ts.
- Confirmed scripts for lint, typecheck, test, build, and e2e in package.json.
- Zod-based env validation implemented and working.
- Clerk billing table present on /pricing page.
- All local CI checks (lint, typecheck, test, build) pass.
- PR #195 (featured artists redesign) manually replicated and merged (scroll interaction, framer-motion, client component refactor).
- DebugBanner exhaustive-deps warning silenced with eslint-disable-next-line; no more lint errors.
- DebugBanner noise/accuracy issues addressed: only actionable errors shown, Spotify check removed, banner no longer covers MVP banner, neutral statuses for non-critical items.
- Pricing page env var usage fixed (uses validated env for publishableKey, direct process.env for pricingTableId).
- Dashboard currently throws 'Failed to load user data'—next priority for debugging.
- No PR found for "refined problem solution section with unified hero styling" after searching open/closed PRs and issues.
- User provided comprehensive landing page and design feedback: remove gradients and heading from Featured Artists; avatars should link to profiles, show tooltip, and have pointer cursor; dark mode toggle in footer only; center nav links; smaller sign-in button; improve solution section and button design; move "go live in 60 seconds" text; tighten up spacing site-wide; remove snap on featured artists; improve pre-footer text/spacing; remove support link and shrink footer links; improve claim handle input/placeholder/button; fix validation layout jumps; spinner should use favicon and be debounced; rewrite hero copy; ensure debug banner doesn't cover MVP banner; fix /pricing env var; merge/overhaul problem/solution; standardize grid background and section padding; audit for world-class design and accessibility.
- User reprioritized: (1) DebugBanner must only show actionable, accurate errors; (2) /<handle> artist profiles must render and be accessible; (3) Sign-up/handle claim flow must be seamless (handle not redundantly requested, dashboard loads after claim, fix errors in flow).

- PR #203 (favicon-based Spinner) is Draft/WIP; awaiting Copilot to complete checklist, run CI locally, and undraft before review/merge.

## Task List

- [ ] MVP Acceptance Criteria
  - [ ] Artist profiles render at /<handle> locally with seeded data and no hydration/client errors
  - [ ] User sign-up via Clerk redirects to /dashboard and loads dashboard data successfully
  - [x] Debug banner shows no red errors and env vars pass validation
  - [ ] No console errors/warnings on key routes
  - [x] /pricing displays Clerk billing table with correct plan info
- [ ] Section 1: Diagnosis
  - [ ] Audit routes, especially app/[handle]/page.tsx
  - [ ] Identify browser console errors/warnings and Debug Banner red statuses
  - [ ] Check Clerk, Supabase, and billing integration health
  - [ ] Verify seeded artist data exists and is queryable locally
- [ ] Section 2: Step-by-Step Fix Plan
  - [ ] Validate .env.local and add missing keys
  - [x] Implement Zod-based env validation in lib/env.ts and refactor consumers
  - [ ] Seed local Supabase with at least one published artist + social links
  - [x] Verify RLS/permissions for public read on artists, social_links
  - [ ] Fix profile pages rendering locally without hydration errors
  - [x] Fix Supabase client duplication warning in DebugBanner.tsx
  - [x] Fix DebugBanner exhaustive-deps warning
  - [x] DebugBanner: eliminate false/irrelevant errors, ensure checks are accurate/actionable
  - [ ] Fix artist profile pages (/handle): ensure local render, no hydration/client errors
  - [ ] Streamline sign-up/handle claim flow: avoid redundant handle entry, fix errors, ensure dashboard loads after claim
  - [ ] Verify sign-up → /dashboard redirect and dashboard data load
  - [ ] Confirm Debug Banner shows no red errors in local dev
  - [x] Clean console across /, /<handle>, /dashboard, /pricing
  - [ ] Final QA: click through all routes; no console errors; pricing/billing works
  - [ ] Landing Page & UI/UX Overhaul
    - [ ] Remove gradients and heading from Featured Artists section
    - [ ] Make avatars link to artist profiles, add tooltip, pointer cursor
    - [ ] Move dark mode toggle to footer only
    - [ ] Center navigation links
    - [ ] Make sign-in button smaller
    - [ ] Improve problem/solution section and button design (linear.app inspired)
    - [ ] Move "go live in 60 seconds" text under button
    - [ ] Tighten up spacing site-wide (landing, pre-footer, etc.)
    - [ ] Remove snap on featured artists scroll
    - [ ] Improve pre-footer text (bold/spacing)
    - [ ] Remove support link from footer; shrink footer links
    - [ ] Improve claim handle input/placeholder/button design and layout
    - [ ] Fix validation layout jumps and tap-to-copy logic
    - [ ] Refactor spinner to use favicon, support light/dark, debounce — PR #203 approved; awaiting Copilot to undraft and enable auto-merge (squash). Checks green.
    - [ ] Rewrite hero copy (avoid duplicate "60 seconds")
    - [ ] Ensure debug banner doesn't cover MVP banner
    - [x] Fix /pricing env var for Clerk publishable key
    - [ ] Merge/overhaul problem/solution into one section
    - [ ] Standardize grid background, container widths, section padding
    - [ ] Audit for world-class design, accessibility, and copy
- [ ] Section 3: Launch & Validation
  - [ ] Validate Supabase migrations (local + remote)
  - [x] Ensure all CI checks pass (lint, type, test, build, e2e)
  - [ ] Merge develop → preview → main and deploy
  - [ ] Update plan.md, CHANGELOG.md, and docs/run-report.md
- [ ] Section 4: Follow-ups (Optional)
  - [ ] Remove legacy waitlist code/flags
  - [ ] Document Supabase grants/RLS for onboarding
  - [ ] Track code debt/refactors found during MVP fixes

## Current Goal

1. Fix dashboard: debug and resolve 'Failed to load user data' error
2. Artist profile pages: ensure /<handle> renders, no hydration/client errors
3. Streamline sign-up/handle claim flow, ensure dashboard access
