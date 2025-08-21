import { test, expect } from '@playwright/test';

test.describe('Featured Artists on Homepage', () => {
  test('featured artists section loads and displays artists', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Should load homepage successfully
    await expect(page).toHaveURL('/');

    // Wait for featured artists section to load
    await page.waitForSelector(
      'h2:has-text("Featured Creators"), [data-testid="featured-artists"]',
      {
        timeout: 10000,
      }
    );

    // Check for featured artists heading
    const featuredHeading = page.locator('h2').filter({
      hasText: /featured.*creators/i,
    });
    await expect(featuredHeading.first()).toBeVisible();

    // Check that artist cards/links are present
    const artistElements = page.locator(
      'a[href^="/"], .artist-card, [data-testid="artist-card"]'
    );
    const artistCount = await artistElements.count();

    // Should have at least 3 featured artists
    expect(artistCount).toBeGreaterThanOrEqual(3);

    // Check that artist names/handles are visible
    const artistNames = page.locator(
      'text=/^[a-zA-Z]+ [a-zA-Z]+$|@[a-zA-Z]+|[a-zA-Z]+$/'
    );
    const visibleNames = await artistNames.filter({ hasText: /.+/ }).count();
    expect(visibleNames).toBeGreaterThan(0);
  });

  test('featured artists are clickable and lead to profile pages', async ({
    page,
  }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Wait for featured artists to load
    await page.waitForSelector('h2:has-text("Featured Creators")', {
      timeout: 10000,
    });

    // Find first clickable artist link
    const artistLink = page
      .locator('a[href^="/"]')
      .filter({
        hasText: /[a-zA-Z]/,
      })
      .first();

    // Should have at least one artist link
    await expect(artistLink).toBeVisible();

    // Get the href to verify it's a valid profile link
    const href = await artistLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/[a-zA-Z0-9_-]+$/);

    // Click the artist link
    await artistLink.click();

    // Should navigate to artist profile page
    await expect(page).toHaveURL(href!);

    // Should show artist profile content
    const profileContent = page.locator(
      'h1, h2, .artist-name, [data-testid="artist-name"]'
    );
    await expect(profileContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('featured artists load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for featured artists to load
    await page.waitForTimeout(3000);

    // Check for critical errors (ignore harmless ones)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Failed to load resource') && // Image 404s
        !error.includes('net::ERR_FAILED') && // Network errors
        !error.includes('i.scdn.co') && // Spotify image errors
        !error.includes('CORS') // External service CORS
    );

    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });

  test('featured artists display images correctly', async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Wait for featured artists section
    await page.waitForSelector('h2:has-text("Featured Creators")', {
      timeout: 10000,
    });

    // Find artist images
    const artistImages = page.locator(
      'img[alt*="artist"], img[alt*="profile"], img[src*="avatar"]'
    );
    const imageCount = await artistImages.count();

    if (imageCount > 0) {
      // Check that at least one image loads successfully
      const firstImage = artistImages.first();
      await expect(firstImage).toBeVisible();

      // Check that image has proper attributes
      const src = await firstImage.getAttribute('src');
      const alt = await firstImage.getAttribute('alt');

      expect(src).toBeTruthy();
      expect(alt).toBeTruthy();
    }
  });

  test('featured artists section is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Featured artists should still be visible on mobile
    const featuredSection = page.locator('h2').filter({
      hasText: /featured.*creators/i,
    });
    await expect(featuredSection.first()).toBeVisible();

    // Artist elements should be accessible on mobile
    const artistElements = page.locator('a[href^="/"]');
    const mobileArtistCount = await artistElements.count();
    expect(mobileArtistCount).toBeGreaterThan(0);

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Should still show featured artists
    await expect(featuredSection.first()).toBeVisible();

    const tabletArtistCount = await artistElements.count();
    expect(tabletArtistCount).toBeGreaterThan(0);
  });
});
