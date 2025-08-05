import { chromium } from '@playwright/test';

async function globalSetup() {
  // Set up environment variables for testing
  Object.assign(process.env, {
    NODE_ENV: 'test',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_dummy',
    CLERK_SECRET_KEY: 'sk_test_dummy',
    NEXT_PUBLIC_SUPABASE_URL: 'https://dummy.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'dummy_key',
  });

  // Start browser to warm up
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app to ensure it's ready
  await page.goto('http://localhost:3000');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  await browser.close();
}

export default globalSetup;
