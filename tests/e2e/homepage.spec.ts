import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main heading and CTA', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('One link. All your music.');
    await expect(page.getByRole('link', { name: 'Login with Spotify' })).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Login with Spotify' }).click();
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should display feature sections', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Simple Setup')).toBeVisible();
    await expect(page.getByText('Smart Routing')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
  });
});