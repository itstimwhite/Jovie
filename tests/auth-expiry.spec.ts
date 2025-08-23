import { test, expect } from '@playwright/test';

// Test the auth expiry flow
test.describe('Auth Expiry Flow', () => {
  // Enable the feature flag for testing
  test.beforeEach(async ({ page }) => {
    // Mock the feature flag endpoint to enable the expired auth flow
    await page.route('/api/feature-flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          feature_expired_auth_flow: true,
        }),
      });
    });
  });

  test('should handle session expiry and restore draft', async ({ page }) => {
    // Start with a signed-in user
    // Note: This requires test setup with a valid Clerk test account
    await page.goto('/sign-in');
    
    // Fill in test credentials (these should be environment variables in real tests)
    await page.fill('input[name="identifier"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Navigate to a form page (e.g., create link page)
    await page.goto('/dashboard/links/create');
    
    // Fill in form data
    await page.fill('input[name="title"]', 'Test Link');
    await page.fill('input[name="url"]', 'https://example.com');
    
    // Simulate session expiry by intercepting API calls
    await page.route('/api/**', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'SESSION_EXPIRED',
          message: 'Your session has expired',
        }),
      });
    });
    
    // Trigger an API call that will now return 401
    await page.click('button[type="submit"]');
    
    // Wait for redirect to sign-in page with expired reason
    await page.waitForURL((url) => {
      return url.pathname === '/sign-in' && 
             url.searchParams.get('reason') === 'expired' &&
             url.searchParams.has('returnTo');
    });
    
    // Verify expired session banner is shown
    await expect(page.locator('text=Your session has expired')).toBeVisible();
    
    // Sign in again
    await page.fill('input[name="identifier"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect back to the original page
    await page.waitForURL('/dashboard/links/create');
    
    // Verify form data was restored
    await expect(page.locator('input[name="title"]')).toHaveValue('Test Link');
    await expect(page.locator('input[name="url"]')).toHaveValue('https://example.com');
  });

  test('should silently refresh token when possible', async ({ page }) => {
    // Start with a signed-in user
    await page.goto('/sign-in');
    
    // Fill in test credentials
    await page.fill('input[name="identifier"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Add a listener for analytics events
    await page.evaluate(() => {
      window.refreshSuccessful = false;
      document.addEventListener('auth.silent_refresh.success', () => {
        window.refreshSuccessful = true;
      });
    });
    
    // Simulate token refresh by intercepting the first token request
    let refreshAttempted = false;
    await page.route('**/clerk/v1/client/**', async (route) => {
      const url = route.request().url();
      
      // Only intercept the first token request to simulate refresh
      if (url.includes('/token') && !refreshAttempted) {
        refreshAttempted = true;
        
        // Simulate a successful token refresh
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            jwt: 'mock.jwt.token',
            object: 'token',
          }),
        });
      } else {
        // Let other requests pass through
        await route.continue();
      }
    });
    
    // Trigger a token refresh by making an API call
    await page.evaluate(() => {
      // Dispatch custom event to trigger session refresh
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    });
    
    // Wait for the refresh to complete
    await page.waitForFunction(() => window.refreshSuccessful === true);
    
    // Verify we're still on the dashboard (no redirect)
    expect(page.url()).toContain('/dashboard');
  });
});

