import { test, expect } from './setup';

test.describe('Home page responsive layout', () => {
  const sizes = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1280, height: 800 },
  ];

  for (const size of sizes) {
    test(`renders correctly on ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      await expect(
        page.getByText(
          'Connect your music, social media, and merch in one link'
        )
      ).toBeVisible();
    });
  }
});
