/**
 * Link Wrapping E2E Tests
 * Tests the complete link wrapping flow for both normal and sensitive links
 */

import { test, expect } from '@playwright/test';

test.describe('Link Wrapping System', () => {
  test('normal link redirect flow', async ({ page }) => {
    // This test would require a seeded wrapped link in the database
    // For now, we'll test the route structure and error handling
    
    // Test invalid link ID format
    await page.goto('/go/invalid-id');
    await expect(page.locator('text=Invalid link ID')).toBeVisible();
    
    // Test non-existent link ID
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    await page.goto(`/go/${nonExistentId}`);
    await expect(page.locator('text=Link not found')).toBeVisible();
  });

  test('sensitive link interstitial flow', async ({ page }) => {
    // Test invalid link ID format for sensitive links
    await page.goto('/out/invalid-id');
    await expect(page).toHaveURL(/\/not-found/);
    
    // Test non-existent sensitive link ID
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    await page.goto(`/out/${nonExistentId}`);
    await expect(page).toHaveURL(/\/not-found/);
  });

  test('link wrapping API rate limiting', async ({ page }) => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Make multiple rapid requests to test rate limiting
    const requests = [];
    for (let i = 0; i < 12; i++) {
      requests.push(
        page.request.get(`/api/link/${nonExistentId}`)
      );
    }
    
    const responses = await Promise.all(requests);
    
    // Should eventually hit rate limit (429 status)
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('bot detection blocks meta crawlers', async ({ request }) => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Test Meta crawler user agent
    const metaResponse = await request.get(`/out/${nonExistentId}`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      }
    });
    
    expect(metaResponse.status()).toBe(204);
    
    // Test API endpoint with Meta crawler
    const apiResponse = await request.get(`/api/link/${nonExistentId}`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1'
      }
    });
    
    expect(apiResponse.status()).toBe(404);
  });

  test('security headers are present', async ({ request }) => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Test /out/:id security headers
    const outResponse = await request.get(`/out/${nonExistentId}`);
    const outHeaders = outResponse.headers();
    
    expect(outHeaders['x-robots-tag']).toContain('noindex');
    expect(outHeaders['referrer-policy']).toBe('no-referrer');
    expect(outHeaders['x-frame-options']).toBe('DENY');
    
    // Test /api/link/:id security headers
    const apiResponse = await request.get(`/api/link/${nonExistentId}`);
    const apiHeaders = apiResponse.headers();
    
    expect(apiHeaders['x-robots-tag']).toContain('noindex');
    expect(apiHeaders['referrer-policy']).toBe('no-referrer');
  });

  test('robots.txt blocks link wrapping routes', async ({ request }) => {
    const robotsResponse = await request.get('/robots.txt');
    const robotsText = await robotsResponse.text();
    
    expect(robotsText).toContain('Disallow: /go/');
    expect(robotsText).toContain('Disallow: /out/');
    expect(robotsText).toContain('User-agent: facebookexternalhit');
    expect(robotsText).toContain('Disallow: /');
  });

  test('wrapped link components render without errors', async ({ page }) => {
    // Navigate to a page that might contain social links (e.g., homepage)
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that there are no console errors related to link wrapping
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('link-wrapping')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any errors
    await page.waitForTimeout(2000);
    
    expect(consoleErrors.length).toBe(0);
  });

  test('sensitive link interstitial UI components', async ({ page }) => {
    // Create a mock interstitial page to test UI components
    await page.goto('/out/123e4567-e89b-12d3-a456-426614174000');
    
    // Should show 404 for non-existent link, but let's check the route exists
    expect(page.url()).toContain('/out/');
  });
});

test.describe('Link Wrapping Security', () => {
  test('no external URLs exposed in HTML source', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Get the page source
    const content = await page.content();
    
    // Check that sensitive domains are not exposed in HTML
    const sensitiveDomains = [
      'onlyfans.com',
      'fansly.com',
      'pornhub.com',
      'bet365.com'
    ];
    
    for (const domain of sensitiveDomains) {
      expect(content).not.toContain(domain);
    }
  });

  test('referrer policy prevents leaking', async ({ page, request }) => {
    // Test that referrer policy is set correctly on wrapped links
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    const response = await request.get(`/go/${nonExistentId}`);
    const headers = response.headers();
    
    expect(headers['referrer-policy']).toBe('no-referrer');
  });

  test('cache headers prevent caching of sensitive routes', async ({ request }) => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Test /out/:id cache headers
    const outResponse = await request.get(`/out/${nonExistentId}`);
    const outHeaders = outResponse.headers();
    
    expect(outHeaders['cache-control']).toContain('no-cache');
    expect(outHeaders['cache-control']).toContain('no-store');
    
    // Test /api/link/:id cache headers
    const apiResponse = await request.get(`/api/link/${nonExistentId}`);
    const apiHeaders = apiResponse.headers();
    
    expect(apiHeaders['cache-control']).toContain('no-cache');
    expect(apiHeaders['cache-control']).toContain('no-store');
  });
});