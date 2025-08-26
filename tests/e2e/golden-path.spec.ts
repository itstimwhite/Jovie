import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { signInUser } from '../helpers/clerk-auth';

/**
 * Golden Path E2E Test - Critical User Journey
 *
 * This test guards the core user flow that generates revenue:
 * 1. User authentication with existing test user
 * 2. Dashboard access and navigation
 * 3. Public profile accessibility
 *
 * Critical Success Criteria:
 * - Uses existing test user (no new registrations)
 * - Uses data-test selectors, not screenshots
 * - Runs in both preview and production
 * - Alerts on failure via Slack
 * - Completes in <60 seconds
 */

test.describe('Golden Path - Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Check if we have test user credentials
    const hasTestCredentials =
      process.env.E2E_CLERK_USER_USERNAME &&
      process.env.E2E_CLERK_USER_PASSWORD;

    if (!hasTestCredentials) {
      console.log(
        '⚠ Skipping golden path test - no test user credentials configured'
      );
      test.skip();
      return;
    }

    // Validate required environment variables
    const requiredEnvVars = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value || value.includes('mock') || value.includes('dummy')) {
        console.log(`⚠ Skipping test: ${key} is not properly configured`);
        test.skip();
        return;
      }
    }

    // Setup Clerk testing token
    await setupClerkTestingToken({ page });
  });

  test('Authenticated user can access dashboard and view profile', async ({
    page,
  }) => {
    test.setTimeout(60_000); // 60 seconds for auth operations

    // STEP 1: Sign in with test user
    await signInUser(page);

    // STEP 2: Should be redirected to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // STEP 3: Verify dashboard elements are visible
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // STEP 4: Navigate to profile (if user has one)
    const profileLink = page.locator('text=View Profile, text=Public Profile');
    if (await profileLink.isVisible()) {
      await profileLink.click();

      // Should be able to view the profile
      await expect(page).toHaveURL(/\/[a-zA-Z0-9-_]+$/, { timeout: 10000 });
    }
  });

  test('Golden path with listen mode', async ({ page }) => {
    test.setTimeout(45_000);

    // Navigate to existing profile in listen mode (use seed data)
    await page.goto('/dualipa?mode=listen', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Should show the listen mode interface
    await expect(page.locator('text=Choose a Service')).toBeVisible({
      timeout: 10000,
    });

    // Should show DSP options
    const spotifyButton = page.locator('text=Spotify');
    await expect(spotifyButton).toBeVisible();
  });

  test('Golden path with tip mode', async ({ page }) => {
    test.setTimeout(45_000);

    // Navigate to existing profile in tip mode (use seed data)
    await page.goto('/dualipa?mode=tip', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Should show the tip mode interface
    await expect(page.locator('text=Send a Tip')).toBeVisible({
      timeout: 10000,
    });

    // Should show tip options or payment form
    const tipContainer = page.locator(
      '[data-testid="tip-container"], .tip-form'
    );
    await expect(tipContainer).toBeVisible();
  });

  test('Complete onboarding flow with session persistence', async ({
    page,
  }) => {
    test.setTimeout(90_000); // Longer timeout for complete onboarding flow

    // This test specifically catches authentication session expiry during onboarding
    // which was not caught by the existing authenticated user tests

    // STEP 1: Start onboarding flow
    await page.goto('/sign-up');

    // STEP 2: Fill out sign-up form (use test credentials)
    const emailInput = page
      .locator('input[name="emailAddress"]')
      .or(page.getByLabel('Email address'));
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(process.env.E2E_CLERK_USER_USERNAME!);

    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByLabel('Password'));
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);

    const submitButton = page.locator(
      'button:has-text("Continue"), button:has-text("Sign up")'
    );
    await submitButton.click();

    // STEP 3: Handle email verification (if required)
    // This may redirect to verification page or continue directly
    await page.waitForURL((url) => !url.pathname.includes('/sign-up'), {
      timeout: 15000,
    });

    // STEP 4: Should reach onboarding handle selection
    // This is where the session expiry bug occurs
    await expect(
      page.locator(
        'text="Choose your handle", text="This becomes your profile link"'
      )
    ).toBeVisible({
      timeout: 15000,
    });

    // STEP 5: Fill handle input (test session persistence)
      '[data-testid="handle-input"]'
    );
    await handleInput.waitFor({ state: 'visible' });
    await handleInput.fill('testuser' + Date.now());

    // STEP 6: Verify no authentication session expired error
    await expect(
      page.locator('text="Authentication session expired"')
    ).not.toBeVisible();

    // STEP 7: Continue with onboarding
    const continueButton = page.locator('button:has-text("Continue")');
    await continueButton.click();

    // STEP 8: Should proceed to next onboarding step without session expiry
    await expect(
      page.locator('text="Authentication session expired"')
    ).not.toBeVisible();

    // Complete flow should not encounter session expiry
    await page.waitForTimeout(2000); // Allow for any async session checks
    await expect(
      page.locator('text="Authentication session expired"')
    ).not.toBeVisible();
  });
});
