import { test, expect } from '@playwright/test';

/**
 * Smoke tests - verify the app runs without crashing
 */

test.describe('Smoke Tests', () => {
  test('Homepage loads without errors @smoke', async ({ page }) => {
    // Monitor console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore specific expected errors in test environment
        const isClerkError = text.toLowerCase().includes('clerk');
        const isNetworkError = text.includes('Failed to load resource') && 
          (text.includes('clerk') || text.includes('/_next/'));
        const isExpectedTestError = text.includes('Test environment') || 
          text.includes('Mock data');
        
        if (!isClerkError && !isNetworkError && !isExpectedTestError) {
          errors.push(text);
        }
      }
    });

    // Navigate to homepage
    await page.goto('/', { waitUntil: 'networkidle' });

    // Allow for Clerk redirect in test environment
    await page.waitForLoadState('networkidle');

    // Should eventually land on a page (either homepage or Clerk handshake)
    const url = page.url();
    expect(url).toBeTruthy();

    // Check for any content to ensure page renders
    const mainContent = await page.locator('main, [role="main"], body').first();
    await expect(mainContent).toBeVisible();

    // No critical console errors
    expect(errors).toHaveLength(0);
  });

  test('App handles unknown routes gracefully @smoke', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('/non-existent-route-123', { waitUntil: 'networkidle' });

    // Should show 404 page or redirect, not crash
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();

    // Should not have server error
    await expect(page.locator('text=500')).not.toBeVisible();
    await expect(page.locator('text=Internal Server Error')).not.toBeVisible();
  });

  test('Critical pages respond without 500 errors @smoke', async ({ page }) => {
    const routes = ['/', '/sign-up', '/pricing'];

    for (const route of routes) {
      const response = await page.goto(route, {
        waitUntil: 'domcontentloaded',
      });

      // Should not return 500 error
      expect(response?.status()).toBeLessThan(500);
    }
  });
});
