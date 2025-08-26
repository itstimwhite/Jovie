import { Page, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

/**
 * Authenticates a user in Clerk for E2E tests
 * This function handles the complete sign-in flow
 */
export async function signInUser(
  page: Page,
  {
    username = process.env.E2E_CLERK_USER_USERNAME,
    password = process.env.E2E_CLERK_USER_PASSWORD,
  } = {}
) {
  if (!username || !password) {
    throw new Error(
      'E2E test user credentials not configured. Set E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD.'
    );
  }

  // Set up Clerk testing token to bypass bot detection
  await setupClerkTestingToken({ page });

  // Navigate to sign-in page
  await page.goto('/sign-in');

  // Wait for sign-in form to load - look for the heading and form elements
  await expect(page.locator('h1:has-text("Sign in")')).toBeVisible({
    timeout: 10000,
  });

  // Fill in email address
  const emailInput = page.locator('[data-testid="email-input"]');
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill(username);

  // Fill in password
  const passwordInput = page.locator('[data-testid="password-input"]');
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(password);

  // Submit the form
  const submitButton = page.locator('[data-testid="sign-in-submit"]');
  await submitButton.click();

  // Wait for successful authentication (redirect away from sign-in)
  await page.waitForURL((url) => !url.pathname.includes('/sign-in'), {
    timeout: 15000,
  });

  // Verify we're authenticated by checking for user button or dashboard
  await expect(
    page.locator(
      '[data-clerk-element="userButton"], [data-testid="user-menu"], text="Dashboard"'
    )
  ).toBeVisible({ timeout: 10000 });

  return page;
}

/**
 * Signs out the current user
 */
export async function signOutUser(page: Page) {
  // Click user button/menu
  const userButton = page.locator('[data-clerk-element="userButton"]');
  if (await userButton.isVisible()) {
    await userButton.click();

    // Click sign out option
    const signOutButton = page.locator('button:has-text("Sign out")');
    await signOutButton.click();
  } else {
    // Fallback: navigate to sign-out URL
    await page.goto('/sign-out');
  }

  // Wait for sign out to complete
  await page.waitForURL((url) => !url.pathname.includes('/dashboard'), {
    timeout: 10000,
  });
}

/**
 * Checks if a user is currently authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.locator('[data-clerk-element="userButton"]').waitFor({
      state: 'visible',
      timeout: 2000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a test context with authentication setup
 * Use this in beforeEach hooks for tests that require authentication
 */
export async function setupAuthenticatedTest(page: Page) {
  const hasTestCredentials =
    process.env.E2E_CLERK_USER_USERNAME && process.env.E2E_CLERK_USER_PASSWORD;

  if (!hasTestCredentials) {
    console.warn(
      '⚠ Skipping authenticated test - no test user credentials configured'
    );
    throw new Error('Test user credentials not configured');
  }

  await signInUser(page);
  return page;
}
