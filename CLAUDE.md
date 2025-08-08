# Claude AI Guidelines for Jovie Project

## Critical Rules

### ⚠️ **NEVER PUSH TO PREVIEW OR MAIN**

- **ONLY push to `develop` branch**
- **NEVER push directly to `preview` or `main` branches**
- The CI/CD pipeline handles all promotions automatically
- If pipeline is stuck, fix issues on `develop` and let CI handle the rest
- Direct pushes to protected branches will be rejected and can break the pipeline

### 🔒 **Branch Protection**

- `preview` and `main` are protected branches
- All changes must go through the CI/CD pipeline
- Auto-promote workflows handle `develop → preview → main` progression
- Manual intervention should only be done on `develop` branch

## Clerk-Supabase Integration (Primary Method)

**Purpose:** Enforce the **current** and **correct** instructions for integrating Clerk with Supabase using the native integration method.  
**Scope:** All AI-generated advice or code related to Clerk-Supabase integration must follow these guardrails.

---

## **1. Official Clerk-Supabase Integration Overview**

Use only the **native Supabase integration** approach from [Clerk's official documentation](https://clerk.com/docs/raw/integrations/databases/supabase.mdx):

### **1.1 – Setup Requirements**

1. **Configure Clerk as Supabase Third-Party Provider**:
   - In Clerk Dashboard: Navigate to [Supabase integration setup](https://dashboard.clerk.com/setup/supabase)
   - In Supabase Dashboard: Add Clerk as a third-party auth provider
   - Use the Clerk domain provided in the setup

2. **Use Native Integration (NOT JWT Templates)**:
   - The native integration is the **recommended approach** as of April 1st, 2025
   - JWT templates are deprecated and should not be used
   - No need to fetch new tokens for each Supabase request
   - No need to share Supabase JWT secret with Clerk

### **1.2 – Client-Side Integration**

```typescript
// ✅ CORRECT: Use native integration with accessToken
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

function createClerkSupabaseClient() {
  const { session } = useSession();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );
}
```

### **1.3 – Server-Side Integration**

```typescript
// ✅ CORRECT: Use auth() for server-side operations
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
}
```

### **1.4 – RLS Policies**

```sql
-- ✅ CORRECT: Use auth.jwt() for RLS policies
create policy "User can view their own data" on "public"."users"
for select to authenticated using (
  auth.jwt()->>'sub' = user_id
);

create policy "Users must insert their own data" on "public"."users"
for insert to authenticated with check (
  auth.jwt()->>'sub' = user_id
);
```

---

## **2. Clerk Billing with Stripe Integration**

**Purpose:** Enforce the **current** and **correct** instructions for integrating Clerk billing with Stripe for B2C SaaS applications.  
**Scope:** All AI-generated advice or code related to Clerk billing must follow these guardrails.

### **2.1 – Official Clerk Billing Setup**

Use the **Clerk billing with Stripe** approach from [Clerk's official documentation](https://clerk.com/docs/nextjs/billing/b2c-saas):

#### **Setup Requirements:**

1. **Enable Billing in Clerk Dashboard**:
   - Navigate to **Billing Settings** in Clerk Dashboard
   - Enable billing for your application
   - Choose payment gateway: **Clerk development gateway** (test) or **Stripe account** (production)

2. **Create Plans and Features**:
   - Navigate to **Plans** page in Clerk Dashboard
   - Select **Plans for Users** tab
   - Create subscription plans with features
   - Set **Publicly available** option as needed

3. **Use Clerk's Pricing Components**:
   - Use `<PricingTable />` component for pricing pages
   - Use `has()` method for plan/feature access control
   - Use `<Protect>` component for React-based protection

### **2.2 – Pricing Page Implementation**

```typescript
// ✅ CORRECT: Create dedicated pricing page
// app/pricing/page.tsx
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
  )
}
```

### **2.3 – Access Control with Plans**

```typescript
// ✅ CORRECT: Use has() method for plan access
import { auth } from '@clerk/nextjs/server'

export default async function PremiumContentPage() {
  const { has } = await auth()
  const hasPremiumAccess = has({ plan: 'premium' })

  if (!hasPremiumAccess) {
    return <h1>Only premium subscribers can access this content.</h1>
  }

  return <h1>Premium Content</h1>
}
```

### **2.4 – Access Control with Features**

```typescript
// ✅ CORRECT: Use has() method for feature access
import { auth } from '@clerk/nextjs/server'

export default async function FeatureContentPage() {
  const { has } = await auth()
  const hasFeatureAccess = has({ feature: 'advanced_analytics' })

  if (!hasFeatureAccess) {
    return <h1>Only users with Advanced Analytics can access this content.</h1>
  }

  return <h1>Advanced Analytics Dashboard</h1>
}
```

### **2.5 – React Component Protection**

```typescript
// ✅ CORRECT: Use Protect component for React-based protection
import { Protect } from '@clerk/nextjs'

export default function ProtectedContentPage() {
  return (
    <Protect
      plan="premium"
      fallback={<p>Only premium subscribers can access this content.</p>}
    >
      <h1>Exclusive Premium Content</h1>
      <p>This content is only visible to premium subscribers.</p>
    </Protect>
  )
}
```

### **2.6 – Environment Variables for Billing**

```bash
# Clerk Billing
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional: Clerk Billing Configuration
NEXT_PUBLIC_CLERK_BILLING_ENABLED=true
NEXT_PUBLIC_CLERK_BILLING_GATEWAY=stripe

# Note: Stripe keys are not needed when using Clerk billing
# Clerk handles the Stripe integration internally
```

---

## **3. CRITICAL INSTRUCTIONS FOR AI MODELS**

### **3.1 – ALWAYS DO THE FOLLOWING**

#### **For Clerk-Supabase Integration:**

1. **Use native Supabase integration** - NOT JWT templates
2. **Use `accessToken()` method** in Supabase client configuration
3. **Use `auth.jwt()`** in RLS policies for user identification
4. **Use `useSession()`** for client-side token access
5. **Use `auth()`** for server-side token access
6. **Configure Clerk as third-party provider** in Supabase dashboard
7. **Enable RLS** on all tables that contain user data
8. **Test authentication flow** with multiple users to verify isolation

#### **For Clerk Billing:**

1. **Use Clerk's billing system** - NOT direct Stripe integration
2. **Use `<PricingTable />` component** for pricing pages
3. **Use `has()` method** for plan/feature access control
4. **Use `<Protect>` component** for React-based protection
5. **Create plans and features** in Clerk Dashboard
6. **Link pricing page** from homepage and navigation
7. **Test billing flow** end-to-end
8. **Handle subscription states** properly

### **3.2 – NEVER DO THE FOLLOWING**

#### **For Clerk-Supabase Integration:**

1. **Do not** use JWT templates - they are deprecated
2. **Do not** manually fetch tokens with `getToken({ template: 'supabase' })`
3. **Do not** use `createClerkClient()` for client-side operations
4. **Do not** hardcode user IDs in RLS policies
5. **Do not** bypass RLS policies
6. **Do not** use the old `authMiddleware()` approach

#### **For Clerk Billing:**

1. **Do not** implement direct Stripe integration
2. **Do not** bypass Clerk's billing system
3. **Do not** hardcode plan/feature checks
4. **Do not** ignore subscription states
5. **Do not** forget to link pricing page

---

## **4. DEPRECATED PATTERNS TO AVOID**

Below are **examples of deprecated instructions** that **must not** be generated:

```typescript
// ❌ DO NOT use JWT templates (deprecated)
const token = await getToken({ template: 'supabase' });

// ❌ DO NOT manually configure JWT headers
const supabase = createClient(url, key, {
  global: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

// ❌ DO NOT use createClerkClient for client-side
import { createClerkClient } from '@clerk/backend';
const clerk = createClerkClient({ secretKey: '...' });

// ❌ DO NOT bypass Clerk billing system
// Use Clerk's billing components and methods instead
```

```sql
-- ❌ DO NOT use hardcoded user IDs in RLS
create policy "bad_policy" on users
for select using (user_id = 'hardcoded-uuid');
```

---

## **5. CORRECT IMPLEMENTATION PATTERNS**

### **5.1 – Client Component Example**

```typescript
'use client';
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export function UserDataComponent() {
  const { session } = useSession();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .single();

    if (error) console.error('Error:', error);
    return data;
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### **5.2 – Server Component Example**

```typescript
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export default async function ServerComponent() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );

  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### **5.3 – RLS Policy Example**

```sql
-- Enable RLS on table
alter table "users" enable row level security;

-- Create policies using auth.jwt()
create policy "Users can view own data" on "users"
for select to authenticated using (
  auth.jwt()->>'sub' = user_id
);

create policy "Users can insert own data" on "users"
for insert to authenticated with check (
  auth.jwt()->>'sub' = user_id
);

create policy "Users can update own data" on "users"
for update to authenticated using (
  auth.jwt()->>'sub' = user_id
);
```

### **5.4 – Pricing Page Example**

```typescript
// app/pricing/page.tsx
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose Your Plan
        </h1>
        <PricingTable />
      </div>
    </div>
  )
}
```

### **5.5 – Homepage Pricing Link Example**

```typescript
// app/page.tsx or components/home/HomeHero.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      {/* Other content */}
      <div className="flex gap-4">
        <Link
          href="/pricing"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View Pricing
        </Link>
        {/* Other buttons */}
      </div>
    </div>
  )
}
```

---

## **6. AI MODEL VERIFICATION STEPS**

Before returning any Clerk integration solution, you **must** verify:

### **For Clerk-Supabase Integration:**

1. **Native Integration**: Is the native Supabase integration being used (not JWT templates)?
2. **Access Token**: Is `accessToken()` method used in Supabase client configuration?
3. **RLS Policies**: Are RLS policies using `auth.jwt()->>'sub'` for user identification?
4. **Client vs Server**: Is the correct approach used for client vs server components?
5. **Security**: Are RLS policies enabled and properly configured?
6. **Deprecation**: Are any deprecated patterns being avoided?

### **For Clerk Billing:**

1. **Pricing Table**: Is `<PricingTable />` component being used?
2. **Access Control**: Is `has()` method or `<Protect>` component being used?
3. **Navigation**: Is pricing page linked from homepage and navigation?
4. **Plans/Features**: Are plans and features created in Clerk Dashboard?
5. **Subscription States**: Are subscription states being handled properly?

If any check **fails**, **stop** and revise until compliance is achieved.

---

## **7. ENVIRONMENT VARIABLES**

Required environment variables for Clerk integration:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key

# Stripe (if using own Stripe account with Clerk billing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## **8. TESTING GUIDELINES**

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

## **9. MIGRATION FROM OLD APPROACH**

If migrating from JWT templates:

1. **Remove JWT template configuration** from Clerk dashboard
2. **Update Supabase client configuration** to use `accessToken()`
3. **Update RLS policies** to use `auth.jwt()->>'sub'`
4. **Remove manual token fetching** from components
5. **Test thoroughly** with existing data

---

## **10. RESOURCES**

- [Clerk Supabase Integration Docs](https://clerk.com/docs/raw/integrations/databases/supabase.mdx)
- [Clerk Billing with Stripe Docs](https://clerk.com/docs/nextjs/billing/b2c-saas)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
