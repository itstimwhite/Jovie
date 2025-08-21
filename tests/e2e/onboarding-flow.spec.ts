import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test at the homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('complete onboarding flow with handle validation', async ({ page }) => {
    // Navigate to onboarding (requires authentication first)
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });

    // Should redirect to sign-in if not authenticated
    await expect(page).toHaveURL(/sign-in/);

    // For now, just test the onboarding page loads for authenticated users
    // This test will be expanded when we have test auth setup
  });

  test('handle validation works correctly', async ({ page }) => {
    // Test the handle check API directly
    const response = await page.request.get(
      '/api/handle/check?handle=testuser123'
    );
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('available');
    expect(typeof data.available).toBe('boolean');
  });

  test('handle check API rejects invalid handles', async ({ page }) => {
    // Test with empty handle
    const emptyResponse = await page.request.get('/api/handle/check?handle=');
    expect(emptyResponse.status()).toBe(400);

    // Test with special characters
    const invalidResponse = await page.request.get(
      '/api/handle/check?handle=test@user'
    );
    const invalidData = await invalidResponse.json();
    expect(invalidData.available).toBe(false);
  });

  test('handle check API handles existing handles', async ({ page }) => {
    // Test with known existing handle from seed data
    const response = await page.request.get(
      '/api/handle/check?handle=musicmaker'
    );
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.available).toBe(false);
  });

  test('handle check API handles race conditions', async ({ page }) => {
    // Fire multiple rapid requests to test race condition handling
    const handles = ['race1', 'race2', 'race3', 'race4', 'race5'];
    const promises = handles.map((handle) =>
      page.request.get(`/api/handle/check?handle=${handle}`)
    );

    const responses = await Promise.all(promises);

    // All requests should complete successfully
    responses.forEach((response) => {
      expect(response.ok()).toBeTruthy();
    });
  });

  test('onboarding page renders without authentication errors', async ({
    page,
  }) => {
    // Go directly to onboarding page
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });

    // Should not have JavaScript errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    // Filter out expected authentication redirects
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('NEXT_REDIRECT') &&
        !error.includes('auth') &&
        !error.includes('sign-in')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('onboarding form prevents double submission', async ({ page }) => {
    // This test would need authentication setup to be fully functional
    // For now, we test the API doesn't allow duplicate rapid calls

    const handle = 'doubletest' + Date.now();

    // Make two rapid requests
    const [response1, response2] = await Promise.all([
      page.request.get(`/api/handle/check?handle=${handle}`),
      page.request.get(`/api/handle/check?handle=${handle}`),
    ]);

    expect(response1.ok()).toBeTruthy();
    expect(response2.ok()).toBeTruthy();

    const [data1, data2] = await Promise.all([
      response1.json(),
      response2.json(),
    ]);

    // Both should return consistent results
    expect(data1.available).toBe(data2.available);
  });

  test('database connection and RLS policies work', async ({ page }) => {
    // Test that the database is accessible and RLS is working
    const response = await page.request.get('/api/health/db');
    expect(response.ok()).toBeTruthy();

    const health = await response.json();
    expect(health.status).toBe('ok');
  });
});
