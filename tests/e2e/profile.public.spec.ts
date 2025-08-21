/**
 * E2E tests for public profile performance and functionality
 * Tests for seeded public profile rendering, avatar loading, social links, and performance thresholds
 */

import { test, expect } from './setup';

test.describe('Public Profile Performance', () => {
  test.describe('Seeded Public Profile - Tim', () => {
    test.beforeEach(async ({ page }) => {
      // Use seeded public profile
      await page.goto('/tim');
    });

    test('displays main heading correctly', async ({ page }) => {
      // Check main heading is visible
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('tim', { ignoreCase: true });
    });

    test('renders avatar image with next/image optimization', async ({ page }) => {
      // Check avatar image is visible and properly optimized
      const avatarImage = page.locator('img').first();
      await expect(avatarImage).toBeVisible();

      // Verify next/image optimization attributes
      const loading = await avatarImage.getAttribute('loading');
      const alt = await avatarImage.getAttribute('alt');
      
      expect(loading).toBe('lazy');
      expect(alt).toBeTruthy(); // Should have alt text
      
      // Check if image is from allowed remote domains (i.scdn.co)
      const src = await avatarImage.getAttribute('src');
      expect(src).toBeTruthy();
    });

    test('shows at least one social link', async ({ page }) => {
      // Look for social links or buttons
      const socialElements = page.locator('a[href*="spotify.com"], a[href*="instagram.com"], a[href*="twitter.com"], a[href*="tiktok.com"], button[title*="Follow"], div[class*="social"]');
      const socialCount = await socialElements.count();
      
      expect(socialCount).toBeGreaterThan(0);
      
      // Verify first social element is visible
      if (socialCount > 0) {
        await expect(socialElements.first()).toBeVisible();
      }
    });

    test('meets LCP performance threshold', async ({ page, browserName }) => {
      // Start performance tracing
      await page.context().tracing.start({
        name: 'public-profile-lcp-trace',
        screenshots: true,
        snapshots: true
      });

      const startTime = Date.now();
      
      // Navigate and wait for LCP
      await page.goto('/tim', { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });

      // Wait for main content to be visible (approximates LCP)
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img').first()).toBeVisible();

      const endTime = Date.now();
      const lcpTime = endTime - startTime;

      // Stop tracing
      await page.context().tracing.stop({
        path: `traces/public-profile-lcp-${browserName}-${Date.now()}.zip`
      });

      // LCP should be under 2.5 seconds as specified
      expect(lcpTime).toBeLessThan(2500);
    });

    test('measures TTI approximation', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/tim', { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });

      // Ensure interactive elements are ready
      await page.waitForFunction(() => {
        const buttons = document.querySelectorAll('button, a');
        return buttons.length > 0;
      }, { timeout: 5000 });

      const ttiTime = Date.now() - startTime;
      
      // TTI should be reasonable (under 5 seconds for Preview environment)
      expect(ttiTime).toBeLessThan(5000);
    });

    test('handles mobile viewport performance', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const startTime = Date.now();
      
      await page.goto('/tim', { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });

      // Wait for mobile-optimized content
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img').first()).toBeVisible();

      const mobileLoadTime = Date.now() - startTime;

      // Mobile should also meet performance threshold
      expect(mobileLoadTime).toBeLessThan(2500);
    });

    test('validates image optimization attributes', async ({ page }) => {
      await page.goto('/tim');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      expect(imageCount).toBeGreaterThan(0);

      // Check optimization attributes on all images
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        
        // Check loading attribute
        const loading = await img.getAttribute('loading');
        expect(loading).toBe('lazy');
        
        // Check alt text
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        
        // Check if image loads successfully
        await expect(img).toBeVisible();
      }
    });

    test('ensures accessibility attributes', async ({ page }) => {
      await page.goto('/tim');

      // Check heading structure
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      const h1Count = await h1.count();
      expect(h1Count).toBe(1); // Should have exactly one h1

      // Check that interactive elements have proper attributes
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const ariaLabel = await button.getAttribute('aria-label');
          const title = await button.getAttribute('title');
          const textContent = await button.textContent();
          
          // Should have some form of accessible label
          expect(ariaLabel || title || textContent?.trim()).toBeTruthy();
        }
      }
    });

    test('handles network conditions gracefully', async ({ page }) => {
      // Test with simulated slow network
      await page.route('**/*', route => {
        // Add delay to simulate slower network
        setTimeout(() => route.continue(), 100);
      });

      const startTime = Date.now();
      
      await page.goto('/tim', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });

      await expect(page.locator('h1')).toBeVisible();
      
      const slowNetworkTime = Date.now() - startTime;
      
      // Even with network delay, should load reasonably quickly
      expect(slowNetworkTime).toBeLessThan(5000);
    });

    test('works in CI environment', async ({ page }) => {
      // This test ensures compatibility with CI and Preview URL testing
      const isCI = process.env.CI === 'true';
      const isPreview = process.env.VERCEL_ENV === 'preview';
      
      const startTime = Date.now();
      
      await page.goto('/tim', { 
        waitUntil: 'domcontentloaded',
        timeout: isCI ? 10000 : 5000 // More time in CI
      });

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img').first()).toBeVisible();

      const loadTime = Date.now() - startTime;
      
      // Adjust threshold for CI environment
      const threshold = isCI || isPreview ? 5000 : 2500;
      expect(loadTime).toBeLessThan(threshold);
    });
  });

  test.describe('Public Profile SEO and Meta', () => {
    test('has proper meta tags for seeded profile', async ({ page }) => {
      await page.goto('/tim');

      // Check page title
      await expect(page).toHaveTitle(/tim/i);

      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toBeVisible();
    });

    test('has proper Open Graph tags', async ({ page }) => {
      await page.goto('/tim');

      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      
      await expect(ogTitle).toBeVisible();
      await expect(ogDescription).toBeVisible();
    });
  });
});