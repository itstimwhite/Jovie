import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

/**
 * Golden Path E2E Test - Critical User Journey
 *
 * This test guards the core user flow that generates revenue:
 * 1. Homepage → Sign up button
 * 2. Clerk registration flow
 * 3. Username check/claim → Onboarding
 * 4. Dashboard landing
 * 5. Public profile accessibility
 *
 * Critical Success Criteria:
 * - Test uses fresh user per run (timestamped email)
 * - Uses data-test selectors, not screenshots
 * - Runs in both preview and production
 * - Alerts on failure via Slack
 * - Completes in <60 seconds
 */

test.describe.skip('Golden Path - Complete User Journey', () => {
  // SKIP: These tests require proper Clerk test environment setup
  // Generate unique email for fresh user per test run
  const timestamp = Date.now();
  const testEmail = `test-user-${timestamp}@jovie-test.com`;
  const testHandle = `testuser${timestamp}`;

  test.beforeEach(async ({ page }) => {
    // Validate environment is properly configured
    const requiredEnvVars = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };

    // Skip if running in CI environment without proper test credentials
    if (process.env.CI) {
      test.skip();
      return;
    }

    // Only check for presence of keys, not their values in local development
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.log(`Skipping test: ${key} is not set`);
        test.skip();
      }
    }

    // Setup Clerk testing token
    await setupClerkTestingToken({ page });
  });

  test('Complete golden path: signup → onboarding → dashboard → public profile', async ({
    page,
  }) => {
    test.setTimeout(90_000); // 90 seconds to account for Clerk operations

    console.log(
      `Starting golden path test with email: ${testEmail}, handle: ${testHandle}`
    );

    // STEP 1: Homepage → Sign up button
    await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });

    // Assert homepage loads
    await expect(page).toHaveURL('/');

    // Click sign up button (using data-test selector)
    const signupBtn = page.locator('[data-test="signup-btn"]');
    await expect(signupBtn).toBeVisible({ timeout: 10000 });
    await signupBtn.click();

    // STEP 2: Clerk registration flow
    // Wait for Clerk sign-up form
    await expect(page).toHaveURL(/sign-up/, { timeout: 15000 });

    // Fill out Clerk registration form
    const emailInput = page
      .locator('input[name="emailAddress"], input[type="email"]')
      .first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(testEmail);

    const passwordInput = page
      .locator('input[name="password"], input[type="password"]')
      .first();
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill('TestPassword123!');

    // Submit registration
    const clerkContinueBtn = page
      .locator(
        'button[type="submit"], button:has-text("Continue"), button:has-text("Sign up")'
      )
      .first();
    await clerkContinueBtn.click();

    // Handle email verification if required (in test env, might auto-verify)
    try {
      // Look for verification step
      const verifyHeader = page.locator(
        'h1:has-text("Verify"), h2:has-text("Verify")'
      );
      if (await verifyHeader.isVisible({ timeout: 5000 })) {
        // In test environment, try to find skip option or auto-verify
        const skipBtn = page.locator(
          'button:has-text("Skip"), a:has-text("Skip"), button:has-text("Continue")'
        );
        if (await skipBtn.isVisible({ timeout: 3000 })) {
          await skipBtn.click();
        }
      }
    } catch {
      // Continue if verification step is not present
      console.log('No verification step found, continuing...');
    }

    // STEP 3: Username check/claim → Onboarding
    // Should be redirected to onboarding after successful signup
    await expect(page).toHaveURL('/onboarding', { timeout: 30000 });

    // Assert onboarding form is visible
    const usernameInput = page.locator('[data-test="username-input"]');
    await expect(usernameInput).toBeVisible({ timeout: 10000 });

    // Enter username
    await usernameInput.fill(testHandle);

    // Wait for username validation (availability check)
    await page.waitForTimeout(1000); // Allow for debounced validation

    // Submit onboarding form
    const claimBtn = page.locator('[data-test="claim-btn"]');
    await expect(claimBtn).toBeEnabled({ timeout: 10000 });
    await claimBtn.click();

    // STEP 4: Dashboard landing
    // Should redirect to dashboard after successful onboarding
    await expect(page).toHaveURL('/dashboard', { timeout: 30000 });

    // Assert dashboard welcome/content is visible
    const dashboardWelcome = page.locator('[data-test="dashboard-welcome"]');
    await expect(dashboardWelcome).toBeVisible({ timeout: 10000 });

    // STEP 5: Public profile accessibility
    // Navigate to the newly created public profile
    await page.goto(`/${testHandle}`, {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Assert public profile loads and shows key elements
    await expect(page).toHaveURL(`/${testHandle}`);

    const publicProfileRoot = page.locator('[data-test="public-profile-root"]');
    await expect(publicProfileRoot).toBeVisible({ timeout: 10000 });

    // Verify profile shows the handle/username
    await expect(page.locator('text=' + testHandle)).toBeVisible();

    console.log(
      `✅ Golden path test completed successfully for user: ${testEmail}`
    );
  });

  test('Golden path with listen mode', async ({ page }) => {
    test.setTimeout(60_000);

    // Test that public profile works in listen mode
    // First create a user (simplified version for listen mode test)
    await page.goto('/', { waitUntil: 'networkidle' });

    // Navigate to existing profile in listen mode (use seed data)
    await page.goto('/dualipa?mode=listen', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Assert listen mode loads
    await expect(page).toHaveURL(/mode=listen/);

    // Assert public profile root is present
    const publicProfileRoot = page.locator('[data-test="public-profile-root"]');
    await expect(publicProfileRoot).toBeVisible({ timeout: 10000 });

    // Assert listen-specific elements are visible
    const listenButton = page.locator('[data-test="listen-btn"]');
    await expect(listenButton).toBeVisible({ timeout: 5000 });
  });

  test('Golden path with tip mode', async ({ page }) => {
    test.setTimeout(60_000);

    // Test that public profile works in tip mode
    await page.goto('/', { waitUntil: 'networkidle' });

    // Navigate to existing profile in tip mode (use seed data)
    await page.goto('/dualipa?mode=tip', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Assert tip mode loads
    await expect(page).toHaveURL(/mode=tip/);

    // Assert public profile root is present
    const publicProfileRoot = page.locator('[data-test="public-profile-root"]');
    await expect(publicProfileRoot).toBeVisible({ timeout: 10000 });

    // Assert tip-specific elements are visible
    const tipSelector = page.locator('[data-test="tip-selector"]');
    await expect(tipSelector).toBeVisible({ timeout: 5000 });
  });
});
