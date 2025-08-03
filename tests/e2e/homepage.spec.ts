import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('shows the claim profile flow', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Link in bio');
    await expect(page.getByPlaceholder('Search artists...')).toBeVisible();
  });
});
