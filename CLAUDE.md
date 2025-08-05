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

## **2. CRITICAL INSTRUCTIONS FOR AI MODELS**

### **2.1 – ALWAYS DO THE FOLLOWING**

1. **Use native Supabase integration** - NOT JWT templates
2. **Use `accessToken()` method** in Supabase client configuration
3. **Use `auth.jwt()`** in RLS policies for user identification
4. **Use `useSession()`** for client-side token access
5. **Use `auth()`** for server-side token access
6. **Configure Clerk as third-party provider** in Supabase dashboard
7. **Enable RLS** on all tables that contain user data
8. **Test authentication flow** with multiple users to verify isolation

### **2.2 – NEVER DO THE FOLLOWING**

1. **Do not** use JWT templates - they are deprecated
2. **Do not** manually fetch tokens with `getToken({ template: 'supabase' })`
3. **Do not** use `createClerkClient()` for client-side operations
4. **Do not** hardcode user IDs in RLS policies
5. **Do not** bypass RLS policies
6. **Do not** use the old `authMiddleware()` approach

---

## **3. DEPRECATED PATTERNS TO AVOID**

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
```

```sql
-- ❌ DO NOT use hardcoded user IDs in RLS
create policy "bad_policy" on users
for select using (user_id = 'hardcoded-uuid');
```

---

## **4. CORRECT IMPLEMENTATION PATTERNS**

### **4.1 – Client Component Example**

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

### **4.2 – Server Component Example**

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

### **4.3 – RLS Policy Example**

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

---

## **5. AI MODEL VERIFICATION STEPS**

Before returning any Clerk-Supabase integration solution, you **must** verify:

1. **Native Integration**: Is the native Supabase integration being used (not JWT templates)?
2. **Access Token**: Is `accessToken()` method used in Supabase client configuration?
3. **RLS Policies**: Are RLS policies using `auth.jwt()->>'sub'` for user identification?
4. **Client vs Server**: Is the correct approach used for client vs server components?
5. **Security**: Are RLS policies enabled and properly configured?
6. **Deprecation**: Are any deprecated patterns being avoided?

If any check **fails**, **stop** and revise until compliance is achieved.

---

## **6. ENVIRONMENT VARIABLES**

Required environment variables for Clerk-Supabase integration:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

---

## **7. TESTING GUIDELINES**

When testing Clerk-Supabase integration:

1. **Test with multiple users** to ensure data isolation
2. **Verify RLS policies** work correctly
3. **Test both client and server components**
4. **Check authentication flow** end-to-end
5. **Verify error handling** for unauthorized access

---

## **8. MIGRATION FROM OLD APPROACH**

If migrating from JWT templates:

1. **Remove JWT template configuration** from Clerk dashboard
2. **Update Supabase client configuration** to use `accessToken()`
3. **Update RLS policies** to use `auth.jwt()->>'sub'`
4. **Remove manual token fetching** from components
5. **Test thoroughly** with existing data

---

## **9. RESOURCES**

- [Clerk Supabase Integration Docs](https://clerk.com/docs/raw/integrations/databases/supabase.mdx)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
