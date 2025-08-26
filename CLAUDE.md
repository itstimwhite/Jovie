# Claude AI Guidelines for Jovie Project

## 🚦 Jovie PR & Integration Rules

1. **Intent**
   - Clearly define the purpose of the PR or integration.
   - Ensure it aligns with project goals and KPIs.
   - Keep scope focused on one primary user-visible outcome.

2. **Triggers**
   - Use feature flags to gate new functionality.
   - Name flags using lowercase snake*case: `feature*<slug>`.
   - Trigger PostHog events for key user actions.
   - Ensure events fire in all UI modes (light/dark).

3. **Environment**
   - Work exclusively on feature branches derived from `preview`.
   - Never push directly to `preview` or `production`.
   - Use standardized branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
   - Keep branches scoped to 3–6 words in kebab-case.

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

11. **Feature Development Flow**
    - Step 1: Branch from `preview` with proper naming.
    - Step 2: Scope to one user-visible outcome.
    - Step 3: Implement behind feature flag.
    - Step 4: Add PostHog instrumentation.
    - Step 5: Add tests (unit + E2E).
    - Step 6: Create PR with required info.
    - Step 7: Pass all CI/CD checks.
    - Step 8: Deploy and roll out progressively.

12. **Clerk-Supabase Integration**
    - Use native Supabase integration; avoid JWT templates.
    - Use `accessToken()` in Supabase client config.
    - Use `auth.jwt()` in RLS policies.
    - Use `useSession()` client-side, `auth()` server-side.
    - Configure Clerk as third-party provider in Supabase.
    - Enable RLS on all user data tables.
    - Test with multiple users for isolation.
    - Avoid deprecated patterns like manual token fetching or `createClerkClient()`.

13. **Stripe Billing**
    - Integrate Stripe billing directly, server-only.
    - Do not use Clerk Billing or related components.
    - Use Stripe Checkout, Portal, and Webhook APIs on server routes.
    - Never bypass Clerk billing system.
    - Test billing flows end-to-end.
    - Handle subscription states properly.

14. **Deprecated Patterns**
    - Do NOT use JWT templates or manual token fetching.
    - Do NOT hardcode user IDs in RLS policies.
    - Do NOT bypass RLS or Clerk billing system.
    - Do NOT use client SDKs for database or billing access.
    - Do NOT use `createClerkClient()` for client operations.
    - Avoid old `authMiddleware()` approach.

---

## Auth & Access (Clerk → Server-only)

**Purpose:** Enforce secure, server-only authentication and access patterns using Clerk for auth and Drizzle for database access.  
**Scope:** All AI-generated advice or code related to authentication, authorization, and database access must follow these guardrails.

---

## **1. Official Auth & Database Integration Overview**

Follow these principles for secure, scalable authentication and access:

### **1.1 – Setup Requirements**

1. **Configure Clerk as Identity Provider**:
   - In Clerk Dashboard: Set up your application and obtain the publishable and secret keys.
   - Use Clerk's session tokens server-side to authenticate users.

2. **Database Access via Drizzle**:
   - Use Drizzle ORM for all database access.
   - Do not use `@supabase/supabase-js` on the client or server for querying data.

3. **Session Variable Propagation**:
   - Set PostgreSQL session variables (e.g., `app.user_id`) for each authenticated request.
   - Use these variables in RLS policies (see below).

---

## **2. Database Layer (Drizzle-first, Neon-ready)**

**Purpose:** Use Drizzle ORM to interact with Postgres (or Neon) via a driver abstraction that supports both Node Postgres and Neon HTTP drivers.

### **2.1 – Driver Abstraction Example**

```typescript
// db/connection.ts
import { drizzle } from 'drizzle-orm/node-postgres'; // or 'drizzle-orm/neon-http'
import { Pool } from 'pg'; // For Node Postgres
// import { NeonHttpDriver } from '@neondatabase/serverless'; // For Neon HTTP

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### **2.2 – Setting Session Variables**

```typescript
// utils/setSessionVars.ts
import { db } from './db/connection';

export async function setSessionUser(userId: string) {
  await db.execute(`set local "app.user_id" = '${userId}'`);
}
```

### **2.3 – Usage in API Route**

```typescript
// app/api/some-resource/route.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/connection';
import { setSessionUser } from '@/utils/setSessionVars';

export async function GET(req: Request) {
  const { userId } = await auth();
  await setSessionUser(userId);
  const data = await db.select().from('users');
  return Response.json(data);
}
```

---

## **3. Postgres Security & Policies**

**Purpose:** Enforce strict security by leveraging session variables and RLS policies referencing `current_setting('app.user_id')`.

### **3.1 – RLS Policy Example**

```sql
-- Enable RLS on table
alter table "users" enable row level security;

-- Use session variable for user identification
create policy "Users can view own data" on "users"
for select to authenticated using (
  current_setting('app.user_id', true) = user_id
);

create policy "Users can insert own data" on "users"
for insert to authenticated with check (
  current_setting('app.user_id', true) = user_id
);

create policy "Users can update own data" on "users"
for update to authenticated using (
  current_setting('app.user_id', true) = user_id
);
```

---

## **4. Storage, Realtime, RPC (server-only)**

**All Supabase features (storage, realtime, RPC, etc.) must be accessed exclusively from server-side endpoints.**  
Never use client SDKs for direct access. Always proxy requests through authenticated server routes that enforce session variables and RLS.

---

## **5. Stripe Billing (Direct)**

**Purpose:** Integrate Stripe billing directly, server-only. Do not use Clerk Billing or any Clerk billing components.

### **5.1 – Stripe Checkout Session Example**

```typescript
// app/api/stripe/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  const { priceId, userId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: 'user@example.com', // Fetch from your user DB
    success_url: 'https://your-app.com/success',
    cancel_url: 'https://your-app.com/cancel',
    metadata: { userId },
  });
  return Response.json({ url: session.url });
}
```

### **5.2 – Stripe Customer Portal Example**

```typescript
// app/api/stripe/portal/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  const { customerId } = await req.json();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'https://your-app.com/account',
  });
  return Response.json({ url: portal.url });
}
```

### **5.3 – Stripe Webhook Example**

```typescript
// app/api/stripe/webhook/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }
  // Handle event types (e.g., subscription.created, invoice.paid)
  return new Response('ok');
}
```

---

## **6. Driver Matrix**

| Driver        | Library/Module              | Example Usage |
| ------------- | --------------------------- | ------------- |
| Node Postgres | `drizzle-orm/node-postgres` | See below     |
| Neon HTTP     | `drizzle-orm/neon-http`     | See below     |

### **6.1 – Node Postgres Example**

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

### **6.2 – Neon HTTP Example**

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { NeonHttpDriver } from '@neondatabase/serverless';
const neon = new NeonHttpDriver(process.env.DATABASE_URL!);
export const db = drizzle(neon);
```

---

## **7. AI MODEL VERIFICATION STEPS**

Before returning any integration solution, you **must** verify:

### **Auth & Access**

1. **No client-side Supabase usage**: All database access is via Drizzle on the server.
2. **Session variable set**: PostgreSQL session variable (`app.user_id`) is set per request.
3. **RLS policies**: Use `current_setting('app.user_id')` in RLS policies.
4. **No deprecated Supabase or Clerk Billing patterns**.

### **Billing**

1. **Stripe Billing only**: All billing flows use direct Stripe integration (Checkout, Portal, webhooks).
2. **No use of Clerk Billing or related components**.
3. **Server-only Stripe API usage**.

If any check **fails**, **stop** and revise until compliance is achieved.

---

## **8. Environment Variables**

Required environment variables for Clerk, database, and Stripe billing:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Postgres/Neon)
DATABASE_URL=postgresql://...

# Stripe (Direct Integration)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## **9. Unit Test Performance Rules**

- Unit tests must run in under 200ms each whenever possible.
- Keep unit test suite lightweight; push heavier coverage into integration/E2E tests.
- Mock external services (Stripe, Clerk, Upstash, Supabase) to avoid network delays.
- Split slow-running tests into separate categories (integration, e2e).
- Follow YC principle: fast feedback loops > exhaustive coverage.

---

## **10. Upstash Usage**

- Use Upstash Redis for rate limiting public endpoints (`@upstash/ratelimit`).
- Use short-TTL caches (≤15 minutes) for public, non-sensitive data to offload Postgres/Neon.
- Use QStash for webhook handling (Stripe, Clerk) with retries and dead-letter queue.
- All usage is server-only; never expose tokens or Upstash client to the browser.
- Do not cache or queue sensitive PII unless encrypted.
- Keep regional deployments aligned with Neon/Vercel for low latency.

---

## **11. TESTING GUIDELINES**

When testing Clerk integration:

### **For Clerk-Supabase Integration:**

1. **Test with multiple users** to ensure data isolation
2. **Verify RLS policies** work correctly
3. **Test both client and server components**
4. **Check authentication flow** end-to-end
5. **Verify error handling** for unauthorized access

### **For Clerk Billing:**

1. **Test pricing page** displays correctly
2. **Test subscription flow** end-to-end
3. **Test plan/feature access control**
4. **Test navigation** to pricing page
5. **Test subscription state handling**

---

## **12. MIGRATION FROM OLD APPROACH**

If migrating from JWT templates:

1. **Remove JWT template configuration** from Clerk dashboard
2. **Update Supabase client configuration** to use `accessToken()`
3. **Update RLS policies** to use `auth.jwt()->>'sub'`
4. **Remove manual token fetching** from components
5. **Test thoroughly** with existing data

---

## **13. RESOURCES**

- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Neon Serverless Docs](https://neon.tech/docs/introduction)
- [Postgres RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Stripe API Docs](https://stripe.com/docs/api)
