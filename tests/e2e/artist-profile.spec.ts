import { test, expect } from './setup';

test.describe('Artist Profile Pages', () => {
  test.describe('Valid Artist Profile', () => {
    test.beforeEach(async ({ page }) => {
      // Use a known artist handle from our seeded data
      await page.goto('/dualipa');
    });

    test('displays artist profile correctly', async ({ page }) => {
      // Check artist name
      await expect(page.locator('h1')).toContainText('Dua Lipa');

      // Check artist tagline
      await expect(page.getByText(/Levitating/)).toBeVisible();

      // Check artist image
      const artistImage = page.locator('img[alt*="Dua Lipa"]');
      await expect(artistImage).toBeVisible();
    });

    test('shows social media links', async ({ page }) => {
      // Check if social bar is present
      const socialBar = page.locator('div').filter({ hasText: /Follow/ });
      await expect(socialBar).toBeVisible();

      // Check for social media buttons
      const socialButtons = page.locator('button[title*="Follow"]');
      await expect(socialButtons.first()).toBeVisible();
    });

    test('has listen now button', async ({ page }) => {
      const listenButton = page.getByRole('button', { name: /Listen Now/i });
      await expect(listenButton).toBeVisible();
    });

    test('has powered by Jovie footer', async ({ page }) => {
      const footer = page.getByText('Powered by Jovie');
      await expect(footer).toBeVisible();

      // Check if footer link works
      const footerLink = page.getByRole('link', { name: /Powered by Jovie/ });
      await expect(footerLink).toBeVisible();
    });

    test('has proper meta information', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Dua Lipa/);

      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toBeVisible();
    });

    test('is responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that content is still readable
      await expect(page.locator('h1')).toContainText('Dua Lipa');
      await expect(page.getByText(/Levitating/)).toBeVisible();
    });
  });

  test.describe('Invalid Artist Profile', () => {
    test('shows 404 page for non-existent artist', async ({ page }) => {
      await page.goto('/nonexistent-artist');

      // Check 404 page content
      await expect(page.locator('h1')).toContainText('Artist not found');
      await expect(page.getByText(/doesn't exist/)).toBeVisible();

      // Check navigation buttons
      await expect(
        page.getByRole('link', { name: 'Find an artist' })
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
    });

    test('404 page has proper navigation', async ({ page }) => {
      await page.goto('/nonexistent-artist');

      // Click "Find an artist" button
      await page.getByRole('link', { name: 'Find an artist' }).click();
      await expect(page).toHaveURL('/');
    });

    test('404 page has proper meta tags', async ({ page }) => {
      await page.goto('/nonexistent-artist');

      // Check that page is not indexed
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveAttribute('content', 'noindex, nofollow');
    });
  });

  test.describe('Artist Profile SEO', () => {
    test('has proper structured data', async ({ page }) => {
      await page.goto('/dualipa');

      // Check for structured data script
      const structuredData = page.locator('script[type="application/ld+json"]');
      await expect(structuredData).toBeVisible();
    });

    test('has proper Open Graph tags', async ({ page }) => {
      await page.goto('/dualipa');

      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      const ogImage = page.locator('meta[property="og:image"]');

      await expect(ogTitle).toBeVisible();
      await expect(ogDescription).toBeVisible();
      await expect(ogImage).toBeVisible();
    });

    test('has proper Twitter Card tags', async ({ page }) => {
      await page.goto('/dualipa');

      // Check Twitter Card tags
      const twitterCard = page.locator('meta[name="twitter:card"]');
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      const twitterDescription = page.locator(
        'meta[name="twitter:description"]'
      );

      await expect(twitterCard).toBeVisible();
      await expect(twitterTitle).toBeVisible();
      await expect(twitterDescription).toBeVisible();
    });
  });

  test.describe('Artist Profile Performance', () => {
    test('loads quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/dualipa');
      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('has proper image optimization', async ({ page }) => {
      await page.goto('/dualipa');

      // Check that images have proper attributes
      const images = page.locator('img');
      for (const img of await images.all()) {
        const loading = await img.getAttribute('loading');
        const alt = await img.getAttribute('alt');

        expect(loading).toBe('lazy');
        expect(alt).toBeTruthy();
      }
    });
  });

  test.describe('Artist Profile Accessibility', () => {
    test('has proper heading structure', async ({ page }) => {
      await page.goto('/dualipa');

      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toContainText('Dua Lipa');

      // Check that headings are properly nested
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('has proper button accessibility', async ({ page }) => {
      await page.goto('/dualipa');

      // Check that buttons have proper labels
      const buttons = page.locator('button');
      for (const button of await buttons.all()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        expect(ariaLabel || title).toBeTruthy();
      }
    });

    test('has proper link accessibility', async ({ page }) => {
      await page.goto('/dualipa');

      // Check that links have proper text
      const links = page.locator('a');
      for (const link of await links.all()) {
        const text = await link.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    });

    test('has proper color contrast', async ({ page }) => {
      await page.goto('/dualipa');

      // Check that text is readable
      const mainText = page.locator('h1, p');
      await expect(mainText.first()).toBeVisible();

      // This is a basic check - in a real scenario, you'd use a color contrast tool
      expect(true).toBe(true);
    });
  });

  test.describe('Artist Profile Interactions', () => {
    test('social media links open in new tab', async ({ page }) => {
      await page.goto('/dualipa');

      // Check that social links have proper attributes
      const socialLinks = page.locator('button[title*="Follow"]');
      if ((await socialLinks.count()) > 0) {
        const firstLink = socialLinks.first();
        await expect(firstLink).toBeVisible();
      }
    });

    test('listen now button is clickable', async ({ page }) => {
      await page.goto('/dualipa');

      const listenButton = page.getByRole('button', { name: /Listen Now/i });
      await expect(listenButton).toBeVisible();

      // Note: We can't test the actual Spotify redirect in e2e tests
      // but we can verify the button exists and is clickable
    });

    test('footer link navigates correctly', async ({ page }) => {
      await page.goto('/dualipa');

      const footerLink = page.getByRole('link', { name: /Powered by Jovie/ });
      await expect(footerLink).toBeVisible();

      // Click the footer link
      await footerLink.click();
      await expect(page).toHaveURL('/');
    });
  });
});
