# Claude AI Guidelines for Jovie Project (Next.js + Edge + Neon + Drizzle + Clerk + Upstash + Tailwind v4 + PostHog + Stripe)

## 🚦 Jovie PR & Integration Rules

1. **Intent**
   - Clearly define the purpose of the PR or integration.
   - Ensure it aligns with project goals and KPIs.
   - Keep scope focused on one primary user-visible outcome.

2. **Triggers**
   - Use feature flags to gate new functionality.
   - Name flags using lowercase snake_case: `feature_<slug>`.
   - Trigger PostHog events for key user actions.
   - Ensure events fire in all UI modes (light/dark).

3. **Environment & Branching**
   - Work exclusively on feature branches derived from `preview`.
   - Never push directly to `preview` or `production`.
   - Standard branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
   - Keep branch names scoped to 3–6 words in kebab-case.

4. **Smoke Steps**
   - Add unit tests for logic.
   - Add E2E smoke tests for primary happy path.
   - Verify lint, typecheck, unit, and E2E tests pass before merge.
   - Ensure preview deploy builds successfully.

5. **Policy**
   - PRs must be up-to-date with `preview`.
   - PR titles formatted as `[feat|fix|chore]: <slug>`.
   - PR body includes:
     1. Goal (1–2 sentences)
     2. KPI target (if applicable)
     3. Feature flag name
     4. New PostHog events added
     5. Rollback plan (typically "disable feature flag")
   - Auto-merge to `preview` allowed after green CI.
   - Promotion to `production` is manual via PR.

6. **Failure Behavior**
   - Disable feature flag to rollback.
   - Monitor Sentry and PostHog for errors.
   - Revert PR if critical issues arise.

7. **Success Behavior**
   - Enable flag internally first.
   - Verify metrics and events.
   - Roll out progressively to all users.

8. **PR Template**
   - Use the standardized template:

     ```
     Title: [feat|fix|chore]: <slug>

     ## Goal
     <1-2 sentences>

     ## KPI Target
     <if applicable>

     ## Feature Flag
     feature_<slug>

     ## PostHog Events
     - event_name_1
     - event_name_2

     ## Rollback Plan
     Disable feature flag
     ```

9. **Post-Open Flow**
   - Ensure PR is rebased onto latest `preview`.
   - Run all CI checks.
   - Address review comments promptly.
   - After merge, deploy preview with flag OFF.
   - Enable flag internally and monitor.

10. **Branching & Protection**
    - `preview` and `production` are protected.
    - No direct pushes allowed.
    - All changes via PR to `preview`.
    - Feature branches must be current with `preview`.
    - Manual promotion from `preview` to `production`.

---

## 🧱 Stack & Packages (Pin to this shape)

- **Package Manager:** pnpm (preferred over npm for speed, determinism, and CI reliability)
- **Next.js (App Router, RSC):** `next`, `react`, `react-dom`
- **DB (Neon + Drizzle):** `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`
- **Auth (Clerk):** `@clerk/nextjs`
- **Cache/Rate Limit (Upstash Redis):** `@upstash/redis`, `@upstash/ratelimit`
- **CSS (Tailwind v4):** `tailwindcss` (v4), optional `clsx`, `tailwind-merge`
- **Analytics & Flags (PostHog):** `posthog-js` (client), `posthog-node` (server)
- **Billing (Stripe):** `stripe` (server), `@stripe/stripe-js` (client)

> Note: No Clerk Billing, no Supabase client SDK for data access.

---

## ⚙️ Runtime Modes on Vercel

- **Edge** for public profile reads and other latency‑sensitive, DB‑read paths.
  - In files: `export const runtime = 'edge'`.
- **Node** for Stripe webhooks, Stripe Checkout creators, heavy crypto, or any Node‑only libs.
  - In files: `export const runtime = 'nodejs'`.
- **Never import Node‑only libraries (e.g., `stripe`, `posthog-node`) in Edge code paths.**

---

## 🔐 Auth (Clerk) — Server‑First

- Add `middleware.ts` with `clerkMiddleware()`; protect only what is private.
- Server APIs/components: `import { auth, currentUser } from '@clerk/nextjs/server'`.
- Client: wrap app in `<ClerkProvider />`; use `useAuth()`/`useUser()` as needed.
- Env must be correct per domain (including previews):
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - Set allowed **Frontend URLs** in Clerk for `*.preview.jov.ie` and production.

---

## 🗄️ Database (Neon) with Drizzle — Edge‑Safe

**Edge client setup (per‑request):**
```ts
// db/index.ts (Edge‑safe)
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!); // Neon HTTP pooled URL
export const db = drizzle(sql);
```

**Migrations (Node‑only):** run `drizzle-kit` via CI or scripts; never from Edge.

**Optional Node driver (non‑Edge):**
```ts
// db/node.ts (Node runtime only)
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
export const dbNode = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }));
```

**Per‑request user context (for policies/auditing):**
```ts
// utils/session.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';

export async function setSessionUser() {
  const { userId } = await auth();
  if (!userId) return;
  await db.execute(`set local "app.user_id" = '${userId}'`);
}
```

---

## 🛡️ Postgres Security & RLS Pattern

Use a PostgreSQL session variable (`app.user_id`) and reference it in RLS.

```sql
-- Enable RLS
alter table "users" enable row level security;

-- Read
create policy "Users can view own data" on "users"
for select using (current_setting('app.user_id', true) = user_id);

-- Insert
create policy "Users can insert own data" on "users"
for insert with check (current_setting('app.user_id', true) = user_id);

-- Update
create policy "Users can update own data" on "users"
for update using (current_setting('app.user_id', true) = user_id);
```

> Never hardcode user IDs in policies. Always set the session variable per request on the server before DB calls.

---

## 🚀 Public Profile Performance Recipe

1. **Runtime:** Edge route/handler (fast TTFB).
2. **Cache first:** Read `profile:${slug}` from Upstash Redis; on miss, query Neon via `neon-http` and store compact JSON.
3. **TTL:** 60–180s with simple `DEL` invalidation on writes; consider a version key per profile.
4. **RSC streaming:** Use Suspense/streaming; ship only the minimal client JS.
5. **PostHog tracking:** client‑side (deferred) and optionally server event for critical counters.

---

## ☁️ Upstash Redis (Edge‑friendly)

```ts
// lib/redis.ts
import { Redis } from '@upstash/redis';
export const redis = Redis.fromEnv();
```

- Use `@upstash/ratelimit` for IP/slug rate limits on public endpoints.
- Keep tokens server‑only; never expose to the browser.
- Optionally use **QStash** for webhook fan‑out/retries (Stripe, Clerk) with DLQ.

---

## 📊 PostHog (Analytics + Flags)

- **Client:** initialize `posthog-js` in a small provider; respect `doNotTrack`.
- **Server:** use `posthog-node` in Node routes for secure event capture and **server‑side flag checks** when SSR must reflect a flag (prevents UI flicker).
- Use Clerk `userId` as `distinct_id` when authenticated; anonymous IDs for public.

---

## 💳 Stripe (Direct; no Clerk Billing)

- **Checkout creator (Node):** `/app/api/stripe/checkout/route.ts`.
- **Customer Portal (Node):** `/app/api/stripe/portal/route.ts`.
- **Webhooks (Node):** `/app/api/stripe/webhook/route.ts` using `stripe.webhooks.constructEvent` with **raw body**.
- Store `stripe_customer_id` keyed by Clerk `userId` in your DB. Do not use Clerk Billing components.

**Do not** import `stripe` in any Edge runtime code.

---

## 🧪 Testing & Performance Rules

- Unit tests target < 200ms each; mock networked deps (Stripe, Clerk, Upstash, PostHog).
- Keep the unit suite fast; push heavier coverage to integration/E2E.
- Separate slow tests into "integration" and "e2e" groups.
- Follow YC principle: fast feedback loops > exhaustive coverage.

---

## ❗ Landmines to Avoid

1. **Edge/Node Leakage:** Importing `stripe`, `posthog-node`, or Node crypto in Edge routes will fail.
2. **Clerk Host Mismatch:** Frontend URLs (incl. preview domains) must be configured in Clerk or you get `Invalid host/JWT` errors.
3. **Wrong Neon Client:** Use `@neondatabase/serverless` + `drizzle-orm/neon-http` on Edge. Node pg pool only in Node runtime.
4. **Running Migrations in Edge:** Never run `drizzle-kit` in Edge paths.
5. **Cache Invalidation:** Always `DEL` or bump a version key on profile edits/plan changes.
6. **SSR Feature Flags:** Resolve PostHog flags server‑side when HTML must reflect the split.
7. **Stripe Webhooks:** Must be Node runtime with raw body; avoid middleware that consumes the body.
8. **Tailwind v4 Plugin Drift:** Remove/replace plugins not v4‑compatible.
9. **Env Separation:** Separate keys/projects for preview vs prod (Clerk, PostHog, Stripe). Avoid data mixing.
10. **Secret Sprawl:** Keep secrets in Vercel envs; do not import into client bundles.

---

## 🔑 Environment Variables (by system)

```bash
# Neon
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
# (Optionally) CLERK_WEBHOOK_SECRET=whsec_...

# Upstash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
POSTHOG_API_KEY=phx_...
POSTHOG_HOST=https://us.i.posthog.com # or EU/self-host
```

---

## 📚 Resources

- Drizzle ORM: https://orm.drizzle.team/docs
- Neon Serverless: https://neon.tech/docs/introduction
- Clerk + Next.js: https://clerk.com/docs/quickstarts/nextjs
- Postgres RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Upstash Redis: https://upstash.com/docs/redis
- PostHog: https://posthog.com/docs
- Stripe API: https://stripe.com/docs/api
