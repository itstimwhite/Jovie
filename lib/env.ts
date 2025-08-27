import { z } from 'zod';

// Centralized environment validation and access
// Use this module instead of reading process.env throughout the app.

const EnvSchema = z.object({
  // Public client-side envs
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://jov.ie'),
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // Stripe public keys
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Cloudinary configuration
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_FOLDER: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // Database configuration (required at runtime, but optional during build)
  DATABASE_URL: z.string().optional(),

  // Server or build-time envs (may be undefined locally)
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),

  // Stripe server-side configuration
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Stripe price IDs for introductory pricing
  STRIPE_PRICE_INTRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_INTRO_YEARLY: z.string().optional(),

  // Stripe price IDs for standard pricing (inactive)
  STRIPE_PRICE_STANDARD_MONTHLY: z.string().optional(),
  STRIPE_PRICE_STANDARD_YEARLY: z.string().optional(),
});
// Safe-parse to avoid hard crashes in production; surface clear errors in dev.
const rawEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie',
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_FOLDER: process.env.CLOUDINARY_UPLOAD_FOLDER,
  CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  DATABASE_URL: process.env.DATABASE_URL,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_INTRO_MONTHLY: process.env.STRIPE_PRICE_INTRO_MONTHLY,
  STRIPE_PRICE_INTRO_YEARLY: process.env.STRIPE_PRICE_INTRO_YEARLY,
  STRIPE_PRICE_STANDARD_MONTHLY: process.env.STRIPE_PRICE_STANDARD_MONTHLY,
  STRIPE_PRICE_STANDARD_YEARLY: process.env.STRIPE_PRICE_STANDARD_YEARLY,
};

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success && process.env.NODE_ENV === 'development') {
  // Log zod issues once in dev to aid setup
  // Do not throw to avoid blocking the entire app; surfaced via env-gated logger in dev/preview

  console.warn('[env] Validation issues:', parsed.error.flatten().fieldErrors);
}

// Export a normalized env object. Optional values may be undefined.
export const env = {
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
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: parsed.success
    ? parsed.data.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: parsed.success
    ? parsed.data.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: parsed.success
    ? parsed.data.CLOUDINARY_API_KEY
    : process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: parsed.success
    ? parsed.data.CLOUDINARY_API_SECRET
    : process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_FOLDER: parsed.success
    ? parsed.data.CLOUDINARY_UPLOAD_FOLDER
    : process.env.CLOUDINARY_UPLOAD_FOLDER,
  CLOUDINARY_UPLOAD_PRESET: parsed.success
    ? parsed.data.CLOUDINARY_UPLOAD_PRESET
    : process.env.CLOUDINARY_UPLOAD_PRESET,
  DATABASE_URL: parsed.success
    ? parsed.data.DATABASE_URL
    : process.env.DATABASE_URL,
  SPOTIFY_CLIENT_ID: parsed.success
    ? parsed.data.SPOTIFY_CLIENT_ID
    : process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: parsed.success
    ? parsed.data.SPOTIFY_CLIENT_SECRET
    : process.env.SPOTIFY_CLIENT_SECRET,
  STRIPE_SECRET_KEY: parsed.success
    ? parsed.data.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: parsed.success
    ? parsed.data.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_INTRO_MONTHLY: parsed.success
    ? parsed.data.STRIPE_PRICE_INTRO_MONTHLY
    : process.env.STRIPE_PRICE_INTRO_MONTHLY,
  STRIPE_PRICE_INTRO_YEARLY: parsed.success
    ? parsed.data.STRIPE_PRICE_INTRO_YEARLY
    : process.env.STRIPE_PRICE_INTRO_YEARLY,
  STRIPE_PRICE_STANDARD_MONTHLY: parsed.success
    ? parsed.data.STRIPE_PRICE_STANDARD_MONTHLY
    : process.env.STRIPE_PRICE_STANDARD_MONTHLY,
  STRIPE_PRICE_STANDARD_YEARLY: parsed.success
    ? parsed.data.STRIPE_PRICE_STANDARD_YEARLY
    : process.env.STRIPE_PRICE_STANDARD_YEARLY,
} as const;

export const flags = {
  // Feature flags controlled via feature-flags.ts instead of env
  feature_image_cdn_cloudinary: false,
} as const;
