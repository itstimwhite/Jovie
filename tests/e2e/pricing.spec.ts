import { test, expect } from './setup';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('displays pricing plans correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Pricing/);

    // Check main heading
    await expect(page.locator('h1')).toContainText(
      'Simple, transparent pricing'
    );

    // Check Free plan
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('$0')).toBeVisible();
    await expect(page.getByText('Custom profile page')).toBeVisible();
    await expect(page.getByText('Includes Jovie branding')).toBeVisible();

    // Check Pro plan
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('$5')).toBeVisible();
    await expect(page.getByText('Remove Jovie branding')).toBeVisible();
    await expect(page.getByText('Most popular')).toBeVisible();
  });

  test('has working call-to-action buttons', async ({ page }) => {
    // Check Free plan CTA
    const freeButton = page.getByRole('link', { name: 'Get started for free' });
    await expect(freeButton).toBeVisible();
    await expect(freeButton).toHaveAttribute('href', '/sign-up');

    // Check Pro plan CTA
    const proButton = page.getByRole('button', { name: 'Go Pro – $5/month' });
    await expect(proButton).toBeVisible();
  });

  test('shows guarantee information', async ({ page }) => {
    await expect(page.getByText('30-day money-back guarantee')).toBeVisible();
  });
});
