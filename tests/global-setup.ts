import { chromium } from '@playwright/test';

async function globalSetup() {
  // When running against an external BASE_URL in CI (e.g., Preview), skip local env overrides and warmup.
  if (process.env.CI && process.env.BASE_URL) {
    return;
  }

  // Set up environment variables for local testing defaults (do not override if already set)
  Object.assign(process.env, {
    NODE_ENV: process.env.NODE_ENV || 'test',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy',
    NEXT_PUBLIC_CLERK_PRICING_TABLE_ID:
      process.env.NEXT_PUBLIC_CLERK_PRICING_TABLE_ID || 'prctbl_dummy',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'sk_test_dummy',
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key',
  });

  // Start browser to warm up
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app to ensure it's ready
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  // Wait for the page to load completely
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

  await browser.close();
}

export default globalSetup;
