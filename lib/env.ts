import { z } from 'zod';

// Centralized environment validation and access
// Use this module instead of reading process.env throughout the app.

const EnvSchema = z
  .object({
    // Public client-side envs
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url({ message: 'Invalid NEXT_PUBLIC_SUPABASE_URL' }),
    // Prefer publishable key; allow legacy anon key as fallback
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, 'Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('https://jov.ie'),
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

    // Server or build-time envs (may be undefined locally)
    SPOTIFY_CLIENT_ID: z.string().optional(),
    SPOTIFY_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // Require at least one Supabase client key
    if (
      !val.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY &&
      !val.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY',
        path: ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'],
      });
    }
  });

// Safe-parse to avoid hard crashes in production; surface clear errors in dev.
const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie',
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
};

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success && process.env.NODE_ENV === 'development') {
  // Log zod issues once in dev to aid setup
  // Do not throw to avoid blocking the entire app; surfaced via env-gated logger in dev/preview
  // eslint-disable-next-line no-console
  console.warn('[env] Validation issues:', parsed.error.flatten().fieldErrors);
}

// Export a normalized env object. Optional values may be undefined.
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: parsed.success
    ? parsed.data.NEXT_PUBLIC_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: parsed.success
    ? parsed.data.NEXT_PUBLIC_APP_URL
    : (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie'),
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_SEGMENT_WRITE_KEY
    : process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
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
} as const;

export const flags = {
  // Feature flags controlled via feature-flags.ts instead of env
} as const;
