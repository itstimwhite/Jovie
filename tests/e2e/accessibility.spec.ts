import { test, expect } from './setup';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility checks @a11y', () => {
  test('home page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('artist profile has no accessibility violations', async ({ page }) => {
    await page.goto('/dualipa');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
