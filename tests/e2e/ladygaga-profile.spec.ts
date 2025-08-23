import { test, expect } from '@playwright/test';

/**
 * End-to-end test to ensure /ladygaga doesn't return 404
 * This test validates the actual page route and rendering
 */

test.describe('Lady Gaga Profile Route', () => {
  test('should not return 404 when visiting /ladygaga @smoke', async ({
    page,
  }) => {
    // Navigate to the ladygaga profile page
    await page.goto('/ladygaga');

    // Should not see a 404 page
    await expect(page.locator('text=404')).not.toBeVisible();
    await expect(page.locator('text=Not Found')).not.toBeVisible();
    await expect(page.locator('text=Page not found')).not.toBeVisible();

    // Should see the artist name in the page
    await expect(page.getByRole('link', { name: 'Lady Gaga' })).toBeVisible();

    // Should have the expected page structure
    await expect(
      page.locator('[data-testid="artist-profile"], .artist-profile, h1, h2')
    ).toBeVisible();

    // Should have a Listen Now button
    await expect(page.locator('text=Listen Now')).toBeVisible();
  });

  test('should have proper page title and metadata', async ({ page }) => {
    await page.goto('/ladygaga');

    // Check that the page title includes Lady Gaga
    await expect(page).toHaveTitle(/Lady Gaga/i);

    // Should not have error status
    const response = await page.goto('/ladygaga');
    expect(response?.status()).toBe(200);
  });

  test('should render profile content without errors', async ({ page }) => {
    // Monitor console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/ladygaga');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Should not have any console errors related to missing profile data
    const profileErrors = errors.filter(
      (error) =>
        error.includes('404') ||
        error.includes('not found') ||
        error.includes('profile') ||
        error.includes('artist')
    );

    expect(profileErrors).toHaveLength(0);
  });

  test('should be able to navigate to listen mode', async ({ page }) => {
    await page.goto('/ladygaga');

    // Click the Listen Now button
    await page.click('text=Listen Now');

    // Should navigate to listen mode
    await expect(page).toHaveURL(/.*ladygaga.*mode=listen/);

    // Should show DSP selection interface
    await expect(page.locator('text=Choose a Service')).toBeVisible();
  });
});
