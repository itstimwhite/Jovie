import { test, expect } from '@playwright/test';

test.describe('Legal Pages', () => {
  test('should display privacy policy', async ({ page }) => {
    await page.goto('/legal/privacy');
    
    await expect(page.locator('h1')).toContainText('Privacy Policy');
    await expect(page.getByText('Information We Collect')).toBeVisible();
    await expect(page.getByText('Contact Us')).toBeVisible();
  });

  test('should display terms of service', async ({ page }) => {
    await page.goto('/legal/terms');
    
    await expect(page.locator('h1')).toContainText('Terms of Service');
    await expect(page.getByText('Acceptance of Terms')).toBeVisible();
    await expect(page.getByText('Contact Information')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/legal/privacy');
    
    await expect(page.getByRole('link', { name: 'Jovie' })).toBeVisible();
    await page.getByRole('link', { name: 'Jovie' }).click();
    await expect(page).toHaveURL('/');
  });
});