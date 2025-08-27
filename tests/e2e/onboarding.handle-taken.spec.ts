import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

/**
 * E2E Test: Handle Taken Prevents Submission
 *
 * This test verifies that when a user enters an already-taken handle during onboarding,
 * the UI shows an error and the submit button remains disabled.
 *
 * Approach:
 * 1. Use a known taken handle from seed data ('musicmaker')
 * 2. Verify error message is displayed
 * 3. Verify submit button is disabled
 *
 * Requirements:
 * - E2E_ONBOARDING_HANDLE_TAKEN=1 environment variable (optional)
 * - Real Clerk and Supabase environment variables
 */

test.describe('Onboarding Handle Taken Prevention', () => {
  // Only run when environment is properly configured
  // If E2E_ONBOARDING_HANDLE_TAKEN is not set, we'll still run the test
  // but with mocked API responses
  const runWithRealAPI = process.env.E2E_ONBOARDING_HANDLE_TAKEN === '1';

  test.beforeEach(async ({ page }) => {
    if (runWithRealAPI) {
      // Validate required environment variables when using real API
      const requiredEnvVars = {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      };

      // Skip if any required env var is missing or contains dummy values
      for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value || value.includes('dummy')) {
          console.log(
            `Skipping test with real API: ${key} is not properly configured`
          );
          test.skip();
        }
      }
    } else {
      // Mock the API endpoint to simulate taken handle
      await page.route('/api/handle/check*', async (route, request) => {
        const url = new URL(request.url());
        const handle = url.searchParams.get('handle');

        // Define known test handles and their availability
        const takenHandles = ['musicmaker', 'existinguser', 'taken'];
        const available = !takenHandles.includes(handle?.toLowerCase() || '');

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ available }),
        });
      });
    }

    // Navigate to onboarding page
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
  });

  test('entering a taken handle shows error and disables submit button', async ({
    page,
  }) => {
    // Set timeout to 30 seconds
    test.setTimeout(30_000);

    // Setup Clerk testing token for authentication if needed
    if (runWithRealAPI) {
      await setupClerkTestingToken({ page });

      // Load homepage to initialize Clerk
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Wait for Clerk to be ready
      await page.waitForFunction(
        () => {
          // @ts-ignore
          return window.Clerk && window.Clerk.isReady();
        },
        { timeout: 10_000 }
      );

      // Navigate to onboarding page
      await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    }

    // Get the handle input field using the stable selector
    const handleInput = page.getByLabel('Enter your desired handle');
    await expect(handleInput).toBeVisible({ timeout: 5_000 });

    // Enter a known taken handle from seed data
    await handleInput.fill('musicmaker');

    // Wait for handle availability check to complete (500ms debounce + network time)
    await page.waitForTimeout(800);

    // Verify error message is displayed
    await expect(page.locator('text="Handle already taken"')).toBeVisible({
      timeout: 5_000,
    });

    // Verify submit button is disabled
    const submitButton = page.getByRole('button', { name: 'Create Profile' });
    await expect(submitButton).toBeDisabled({ timeout: 5_000 });

    // Verify no green checkmark is visible
    await expect(page.locator('.bg-green-500')).not.toBeVisible();

    // Now try with a different taken handle to ensure consistency
    await handleInput.fill('existinguser');
    await page.waitForTimeout(800);

    // Verify error message is still displayed
    await expect(page.locator('text="Handle already taken"')).toBeVisible({
      timeout: 5_000,
    });

    // Verify submit button is still disabled
    await expect(submitButton).toBeDisabled({ timeout: 5_000 });
  });

  test('switching from taken to available handle enables submission', async ({
    page,
  }) => {
    // Set timeout to 30 seconds
    test.setTimeout(30_000);

    // Get the handle input field
    const handleInput = page.getByLabel('Enter your desired handle');
    await expect(handleInput).toBeVisible({ timeout: 5_000 });

    // First enter a taken handle
    await handleInput.fill('musicmaker');
    await page.waitForTimeout(800);

    // Verify submit button is disabled
    const submitButton = page.getByRole('button', { name: 'Create Profile' });
    await expect(submitButton).toBeDisabled({ timeout: 5_000 });

    // Now switch to an available handle
    const uniqueHandle = `e2e-${Date.now().toString(36)}`;
    await handleInput.fill(uniqueHandle);

    // Wait for handle availability check to complete
    await page.waitForTimeout(800);

    // Verify green checkmark is visible
    await expect(page.locator('.bg-green-500')).toBeVisible({
      timeout: 5_000,
    });

    // Verify submit button is now enabled
    await expect(submitButton).toBeEnabled({ timeout: 5_000 });

    // Verify no error message is visible
    await expect(page.locator('text="Handle already taken"')).not.toBeVisible();
  });

  test('handles race conditions correctly when switching between taken and available', async ({
    page,
  }) => {
    // Set timeout to 30 seconds
    test.setTimeout(30_000);

    // Get the handle input field
    const handleInput = page.getByLabel('Enter your desired handle');
    await expect(handleInput).toBeVisible({ timeout: 5_000 });

    // Simulate rapid typing sequence: available -> taken -> available
    const typingSequence = [
      { handle: 'available-handle', expectedAvailable: true },
      { handle: 'musicmaker', expectedAvailable: false },
      { handle: 'unique-handle', expectedAvailable: true },
    ];

    for (let i = 0; i < typingSequence.length; i++) {
      const { handle } = typingSequence[i];

      // Clear input and type new handle rapidly
      await handleInput.fill('');
      await handleInput.fill(handle);

      // Add small delay between rapid inputs to simulate realistic typing
      await page.waitForTimeout(50);
    }

    // Wait for debouncing to complete
    await page.waitForTimeout(800);

    // Final state should match the last typed value (available)
    const lastHandle = typingSequence[typingSequence.length - 1];

    // Check that the input shows the final handle
    await expect(handleInput).toHaveValue(lastHandle.handle);

    // Check availability indicator matches expected state (should be available)
    await expect(page.locator('.bg-green-500')).toBeVisible();

    // Submit button should be enabled
    const submitButton = page.getByRole('button', { name: 'Create Profile' });
    await expect(submitButton).toBeEnabled();
  });
});
