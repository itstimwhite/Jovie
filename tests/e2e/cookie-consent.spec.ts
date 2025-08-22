import { test, expect } from '@playwright/test';

test.describe('Cookie Consent Flow', () => {
  test('should not make analytics calls before consent', async ({ page }) => {
    // Intercept all network requests to analytics endpoints
    await page.route('**/*posthog*', (route) => {
      // Fail the test if any PostHog requests are made
      test.fail(true, 'PostHog request was made before consent');
      return route.continue();
    });

    // Set header to simulate being in a region that requires consent
    await page.setExtraHTTPHeaders({
      'x-show-cookie-banner': '1',
    });

    // Visit the homepage
    await page.goto('/');

    // Verify cookie banner is visible
    const banner = page.locator('[data-testid="cookie-banner"]');
    await expect(banner).toBeVisible();

    // Wait a bit to ensure no analytics calls are made
    await page.waitForTimeout(1000);
  });

  test('should make analytics calls after consent is given', async ({
    page,
  }) => {
    // Create a promise that resolves when a PostHog request is made
    const posthogRequestPromise = page.waitForRequest((request) =>
      request.url().includes('posthog')
    );

    // Set header to simulate being in a region that requires consent
    await page.setExtraHTTPHeaders({
      'x-show-cookie-banner': '1',
    });

    // Visit the homepage
    await page.goto('/');

    // Verify cookie banner is visible
    const banner = page.locator('[data-testid="cookie-banner"]');
    await expect(banner).toBeVisible();

    // Accept all cookies
    await page.locator('text=Accept All').click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Navigate to another page to trigger analytics
    await page.goto('/about');

    // Now we should see a PostHog request
    await posthogRequestPromise;
  });
});
