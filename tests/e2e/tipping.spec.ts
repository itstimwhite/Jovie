import { expect, test } from './setup';

test.describe('Tipping MVP', () => {
  // Test in both light and dark modes
  ['light', 'dark'].forEach(colorMode => {
    test.describe(`in ${colorMode} mode`, () => {
      test.beforeEach(async ({ page }) => {
        // Set color mode
        await page.addInitScript(mode => {
          localStorage.setItem('theme', mode);
        }, colorMode);

        // Enable tipping feature flag
        await page.addInitScript(() => {
          Object.defineProperty(process.env, 'NEXT_PUBLIC_FEATURE_TIPS', {
            value: 'true',
            writable: true,
            configurable: true,
          });
        });
      });

      test('shows tip button on profile with Venmo link', async ({ page }) => {
        // Create a mock profile with Venmo link
        await page.addInitScript(() => {
          // Mock the getCreatorProfileWithLinks function to return a profile with Venmo
          window.__TEST_PROFILE_WITH_VENMO__ = {
            id: 'test-id',
            userId: 'test-user-id',
            username: 'testartist',
            displayName: 'Test Artist',
            bio: 'Test artist bio',
            avatarUrl: 'https://example.com/avatar.jpg',
            isPublic: true,
            isVerified: true,
            isClaimed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            socialLinks: [
              {
                id: 'venmo-link-id',
                platform: 'venmo',
                url: 'https://venmo.com/testartist',
                clicks: 0,
                createdAt: new Date(),
              },
            ],
          };
        });

        // Visit the profile page
        await page.goto('/testartist');
        await page.waitForLoadState('networkidle');

        // Check that the tip button is visible
        const tipButton = page.getByRole('link', { name: 'Tip' });
        await expect(tipButton).toBeVisible();

        // Set up event tracking listener
        let tipClickCaptured = false;
        await page.exposeFunction('__TEST_TIP_CLICK_CAPTURED__', () => {
          tipClickCaptured = true;
        });

        // Intercept PostHog event tracking
        await page.addInitScript(() => {
          const originalPostHogCapture = window.posthog?.capture;
          if (window.posthog) {
            window.posthog.capture = function (eventName, properties) {
              if (eventName === 'tip_click') {
                window.__TEST_TIP_CLICK_CAPTURED__();
              }
              return originalPostHogCapture?.call(
                window.posthog,
                eventName,
                properties
              );
            };
          }
        });

        // Click the tip button
        await tipButton.click();

        // Verify we're on the tip page
        await page.waitForURL('**/testartist?mode=tip');

        // Check that the tip interface is visible
        const tipSelector = page.locator('[data-test="tip-selector"]');
        await expect(tipSelector).toBeVisible();

        // Check that the amount buttons are visible
        const amountButtons = page.locator('button:has-text("$")');
        await expect(amountButtons).toHaveCount(3);

        // Check that the continue button is visible
        const continueButton = page.getByRole('button', { name: 'Continue' });
        await expect(continueButton).toBeVisible();
      });

      test('generates and displays QR code on desktop', async ({ page }) => {
        // Set viewport to desktop size
        await page.setViewportSize({ width: 1280, height: 800 });

        // Visit the profile page
        await page.goto('/testartist?mode=tip');
        await page.waitForLoadState('networkidle');

        // Check that the QR code overlay is visible
        const qrOverlay = page
          .locator('div')
          .filter({ hasText: 'View on mobile' });
        await expect(qrOverlay).toBeVisible();

        // Check that the QR code image is loaded
        const qrImage = qrOverlay.locator('img');
        await expect(qrImage).toBeVisible();

        // Verify QR code contains the correct URL
        const qrSrc = await qrImage.getAttribute('src');
        expect(qrSrc).toContain('api.qrserver.com');
        expect(qrSrc).toContain('testartist');

        // Test closing and reopening the QR overlay
        const closeButton = qrOverlay.getByRole('button', { name: 'Close' });
        await closeButton.click();

        // QR overlay should be hidden
        await expect(qrOverlay).not.toBeVisible();

        // Reopen button should be visible
        const reopenButton = page.getByRole('button', {
          name: 'View on mobile',
        });
        await expect(reopenButton).toBeVisible();

        // Click reopen button
        await reopenButton.click();

        // QR overlay should be visible again
        await expect(qrOverlay).toBeVisible();
      });

      test('selects amount and opens Venmo link', async ({ page, context }) => {
        // Visit the tip page
        await page.goto('/testartist?mode=tip');
        await page.waitForLoadState('networkidle');

        // Select an amount (the middle option)
        const amountButtons = page.locator('button:has-text("$")');
        await amountButtons.nth(1).click();

        // Listen for new pages/tabs
        const pagePromise = context.waitForEvent('page');

        // Click continue button
        const continueButton = page.getByRole('button', { name: 'Continue' });
        await continueButton.click();

        // Get the new page
        const newPage = await pagePromise;
        await newPage.waitForLoadState();

        // Verify the URL contains Venmo
        const url = newPage.url();
        expect(url).toContain('venmo.com');

        // Verify the URL contains the amount parameter
        expect(url).toContain('utm_amount=');

        // Close the new page
        await newPage.close();
      });

      test('shows back button on tip page that returns to profile', async ({
        page,
      }) => {
        // Visit the tip page
        await page.goto('/testartist?mode=tip');
        await page.waitForLoadState('networkidle');

        // Check that the back button is visible
        const backButton = page.getByRole('button', {
          name: 'Back to profile',
        });
        await expect(backButton).toBeVisible();

        // Click the back button
        await backButton.click();

        // Verify we're back on the profile page
        await page.waitForURL('**/testartist');

        // Check that we're on the profile page (tip button is visible)
        const tipButton = page.getByRole('link', { name: 'Tip' });
        await expect(tipButton).toBeVisible();
      });
    });
  });
});
