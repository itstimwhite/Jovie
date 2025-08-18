---
trigger: always_on
---

# feature_development_flow

- Trigger: When AI is asked to implement a new feature, enhancement, or bugfix.

---

## Step 1: Branching

- Always open a new branch from `preview`.
- Branch name format:
  - `feat/<slug>` for new features
  - `fix/<slug>` for bug fixes
  - `chore/<slug>` for infra/cleanup
- `<slug>` = kebab-case 3–6 words summarizing scope.

---

## Step 2: Scoping

- Each task should aim for one user-visible outcome.
- If multiple outcomes, split into separate tasks/branches.
- Tie scope to KPI impact if possible (e.g., “+capture-email”).

---

## Step 3: Implementation

- Wrap new functionality in a feature flag:
  - Default OFF.
  - Name: `feature_<slug>` in lowercase snake_case.
- Add/update PostHog events for primary user actions.
  - Naming convention: `page_element_action` (e.g., `profile_button_click`).
  - Ensure event is fired in both light/dark mode flows.
- Tests required:
  - Unit tests for logic.
  - E2E smoke test for the main happy path.

---

## Step 4: PR Creation

- Open PR against `preview`.
- Title: `[feat|fix|chore]: <slug>`.
- Body must include:
  1. Goal (1–2 sentences).
  2. KPI target (if applicable).
  3. Feature flag name.
  4. New PostHog events added.
  5. Rollback plan (usually “disable feature flag”).

---

## Step 5: CI/CD Checks

- Must pass lint, typecheck, unit, E2E tests.
- Deploy preview must build.
- Chromatic/Storybook check if component touched.

---

## Step 6: Post-Deploy

- After merge → deploy to prod (feature flag still OFF).
- Enable feature flag for internal segment only.
- Verify Sentry + PostHog capture.
- Roll out progressively when stable.

---

## Step 7: Done Criteria

- Code merged to `preview`.
- Feature behind flag, tested minimally, metrics firing.
- PR closed with changelog line auto-generated from title.

---

## Step 8: Merge to Main

- When feature validated in preview/prod → promote branch via CI auto-merge flow to `main`.
- Always tag release.

---

This rule gives Windsurf a repeatable, low-friction loop aligned with YC-style “ship fast, ship safe.”
