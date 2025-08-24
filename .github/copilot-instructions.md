# GitHub Copilot Instructions for Jovie

This repository uses GitHub Copilot (including the Coding Agent) to propose and implement small, focused changes via Pull Requests. Follow these instructions and guardrails when generating code.

## Repository Overview

- Stack: Next.js (App Router), TypeScript, Tailwind CSS
- Auth/Billing: Clerk (auth + pricing table)
- Data: Supabase (RLS enabled), Postgres
- Env validation: `lib/env.ts` (Zod)
- Branches: `develop` (work) → `preview` (staging) → `production`
- CI gates: `lint`, `typecheck`, `test`, `build`, and e2e (if present)

## Definition of Done

- Code compiles and all checks (lint, type, tests, build) pass
- No console errors/warnings on touched routes
- Update `windsurf.plan.md` or reference the plan item in PR body
- Adhere to accessibility (a11y) and design consistency

## Conventions

- Commit messages: Conventional Commits (e.g., `fix(ui): center nav links`)
- PRs: Small, focused; include before/after screenshots for UI changes
- Styling: Tailwind utility-first; prefer existing design tokens/classes
- Accessibility: Preserve focus-visible, aria-labels, color contrast
- Secrets: Never print or commit secrets; do not commit `.env*`
- Env usage:
  - Use `env` from `lib/env.ts` for validated public keys (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
  - Clerk PricingTable: Provide `pricingTableId` in code/config, not via a new env var

## Useful Paths

- `app/(marketing)/` – landing pages and layout
- `components/` – shared UI, `components/home/FeaturedArtists.tsx`, `components/FeaturedArtists.tsx`
- `app/dashboard/page.tsx` – dashboard (fetches Clerk user → Supabase `users` and `artists`)
- `components/DebugBanner.tsx` – developer diagnostics banner
- `lib/supabase.ts` – browser & authenticated clients (Clerk token integration)

## Running Locally (CI parity)

- Install: `npm ci` or `npm install`
- Lint: `npm run lint`
- Types: `npm run typecheck`
- Tests: `npm test -- --watch=false`
- Build: `npm run build`

## PR Quality Checklist (Copilot)

- Keep diffs minimal and targeted to the issue
- No new warnings in console or TypeScript
- Maintain responsive design and dark mode parity
- Prefer composition over duplication; reuse existing components

## Examples of Good Copilot Tasks

- Tailwind spacing/size tweaks, layout alignment, aria improvements
- Simple component refactors without changing data flow
- Replacing ad-hoc loaders with a reusable component
- Updating footer/header link sets and styles

## Non-Goals for Copilot (defer or ask for human review)

- Database schema/RLS changes
- Complex auth/session flow logic
- Destructive changes to onboarding and billing logic

## Labels and Assignment

- Label: `mvp`, `agent:copilot`, and `area:*` (e.g., `area:landing`, `area:fix`)
- Assign: `github-copilot` (the coding agent) or use the repository automation to assign

## Notes

- Debug Banner should be non-noisy; only show actionable info
- Profile pages at `/[handle]` must render without hydration errors
- Sign-up/handle claim flow must be seamless (avoid redundant handle requests)
