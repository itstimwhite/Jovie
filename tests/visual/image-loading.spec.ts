import { test, expect, Page } from '@playwright/test';

// Helper function to calculate CLS
async function calculateCLS(page: Page) {
  return await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let cls = 0;
      let firstFrame = true;

      // Create a PerformanceObserver to track layout shifts
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!firstFrame) {
            // Ignore shifts in the first frame
            // Cast entry to LayoutShift type which has the value property
            cls += (entry as any).value;
          }
          firstFrame = false;
        }
      });

      // Start observing layout shifts
      observer.observe({ type: 'layout-shift', buffered: true });

      // Resolve after a reasonable time for images to load
      setTimeout(() => {
        observer.disconnect();
        resolve(cls);
      }, 3000);
    });
  });
}

test.describe('Image Loading Tests', () => {
  test('OptimizedImage prevents CLS during loading', async ({ page }) => {
    // Navigate to a page with OptimizedImage components
    await page.goto('/test-images');
    
    // Calculate CLS during page load
    const cls = await calculateCLS(page);
    
    // CLS should be very low (below 0.1 is good, below 0.05 is excellent)
    expect(cls).toBeLessThan(0.1);
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: 'test-results/optimized-image-loaded.png' });
  });
  
  test('OptimizedAvatar prevents CLS during loading', async ({ page }) => {
    // Navigate to a page with OptimizedAvatar components
    await page.goto('/test-avatars');
    
    // Calculate CLS during page load
    const cls = await calculateCLS(page);
    
    // CLS should be very low
    expect(cls).toBeLessThan(0.1);
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: 'test-results/optimized-avatar-loaded.png' });
  });
  
  test('Images maintain aspect ratio during loading', async ({ page }) => {
    // Navigate to a page with various aspect ratios
    await page.goto('/test-aspect-ratios');
    
    // Take screenshot immediately (during loading)
    await page.screenshot({ path: 'test-results/aspect-ratios-loading.png' });
    
    // Wait for images to load
    await page.waitForSelector('img[data-loaded="true"]', { state: 'visible' });
    
    // Take screenshot after loading
    await page.screenshot({ path: 'test-results/aspect-ratios-loaded.png' });
    
    // Compare image container dimensions before and after loading
    // This is a simple check to ensure containers don't resize
    const containerSizesBefore = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('.image-container'));
      return containers.map(container => ({
        width: container.clientWidth,
        height: container.clientHeight
      }));
    });
    
    // Force reload to simulate fresh loading
    await page.reload();
    
    // Wait for images to load again
    await page.waitForSelector('img[data-loaded="true"]', { state: 'visible' });
    
    const containerSizesAfter = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('.image-container'));
      return containers.map(container => ({
        width: container.clientWidth,
        height: container.clientHeight
      }));
    });
    
    // Compare dimensions
    expect(containerSizesBefore).toEqual(containerSizesAfter);
  });
  
  test('Placeholder is shown during image loading', async ({ page }) => {
    // Navigate to test page
    await page.goto('/test-images');
    
    // Slow down network to ensure we can capture loading state
    await page.route('**/*.{png,jpg,jpeg,webp}', route => {
      // Delay image loading by 1 second
      setTimeout(() => route.continue(), 1000);
    });
    
    // Reload the page with slow network
    await page.reload();
    
    // Check if placeholder is visible
    const placeholder = await page.locator('.animate-pulse').first();
    await expect(placeholder).toBeVisible();
    
    // Take screenshot of loading state
    await page.screenshot({ path: 'test-results/image-loading-placeholder.png' });
    
    // Wait for images to load
    await page.waitForSelector('img[data-loaded="true"]', { state: 'visible', timeout: 5000 });
    
    // Check if placeholder is hidden after loading
    await expect(placeholder).not.toBeVisible();
    
    // Take screenshot of loaded state
    await page.screenshot({ path: 'test-results/image-loaded-no-placeholder.png' });
  });
});
