import { z } from 'zod';

// Centralized environment validation and access
// Use this module instead of reading process.env throughout the app.

const EnvSchema = z.object({
  // Public client-side envs
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({ message: 'Invalid NEXT_PUBLIC_SUPABASE_URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://jov.ie'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),

  // Server or build-time envs (may be undefined locally)
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),

  // Clerk billing configuration (optional)
  NEXT_PUBLIC_CLERK_BILLING_ENABLED: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_CLERK_BILLING_GATEWAY: z
    .enum(['development', 'stripe'])
    .optional(),
});

// Safe-parse to avoid hard crashes in production; surface clear errors in dev.
const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie',
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  NEXT_PUBLIC_CLERK_BILLING_ENABLED:
    process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED,
  NEXT_PUBLIC_CLERK_BILLING_GATEWAY: process.env
    .NEXT_PUBLIC_CLERK_BILLING_GATEWAY as 'development' | 'stripe' | undefined,
};

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success && process.env.NODE_ENV === 'development') {
  // Log zod issues once in dev to aid setup
  // Do not throw to avoid blocking the entire app; DebugBanner will display statuses
  // eslint-disable-next-line no-console
  console.warn('[env] Validation issues:', parsed.error.flatten().fieldErrors);
}

// Export a normalized env object. Optional values may be undefined.
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: parsed.success
    ? parsed.data.NEXT_PUBLIC_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: parsed.success
    ? parsed.data.NEXT_PUBLIC_APP_URL
    : (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie'),
  NEXT_PUBLIC_POSTHOG_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_POSTHOG_KEY
    : process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: parsed.success
    ? parsed.data.NEXT_PUBLIC_POSTHOG_HOST
    : process.env.NEXT_PUBLIC_POSTHOG_HOST,
  SPOTIFY_CLIENT_ID: parsed.success
    ? parsed.data.SPOTIFY_CLIENT_ID
    : process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: parsed.success
    ? parsed.data.SPOTIFY_CLIENT_SECRET
    : process.env.SPOTIFY_CLIENT_SECRET,
  NEXT_PUBLIC_CLERK_BILLING_ENABLED: parsed.success
    ? parsed.data.NEXT_PUBLIC_CLERK_BILLING_ENABLED
    : (process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED as
        | 'true'
        | 'false'
        | undefined),
  NEXT_PUBLIC_CLERK_BILLING_GATEWAY: parsed.success
    ? parsed.data.NEXT_PUBLIC_CLERK_BILLING_GATEWAY
    : (process.env.NEXT_PUBLIC_CLERK_BILLING_GATEWAY as
        | 'development'
        | 'stripe'
        | undefined),
} as const;

export const flags = {
  clerkBillingEnabled:
    env.NEXT_PUBLIC_CLERK_BILLING_ENABLED === 'true' ? true : false,
  clerkBillingGateway:
    env.NEXT_PUBLIC_CLERK_BILLING_GATEWAY ?? 'not-configured',
} as const;
