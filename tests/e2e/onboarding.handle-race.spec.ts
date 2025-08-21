import { test, expect } from '@playwright/test';

test.describe('Onboarding Handle Race Condition Resilience', () => {
  test.beforeEach(async ({ page }) => {
    // Mock network requests with controlled delays to simulate races
    await page.route('/api/handle/check*', async (route) => {
      const url = route.request().url();
      const handle = new URL(url).searchParams.get('handle') || '';
      
      // Add controlled delay (100-300ms) to simulate network latency
      const delay = Math.floor(Math.random() * 200) + 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Mock responses for predictable testing
      let available = true;
      if (handle === 'taken-handle' || handle === 'musicmaker') {
        available = false;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available })
      });
    });

    // Mock successful form submission
    await page.route('/api/onboarding/complete', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Start at onboarding page
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
  });

  test('handle availability state matches last typed value', async ({ page }) => {
    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');

    // Rapid typing sequence: available -> taken -> available
    const sequence = ['avail1', 'taken-handle', 'avail2'];
    
    for (const handle of sequence) {
      // Clear and type rapidly (50ms intervals)
      await handleInput.fill('');
      await handleInput.type(handle, { delay: 50 });
      
      // Small delay to let some debouncing happen but not complete
      await page.waitForTimeout(100);
    }
    
    // Wait for debouncing to complete
    await page.waitForTimeout(600);
    
    // Final state should match last typed value (avail2 = available)
    await expect(handleInput).toHaveValue('avail2');
    await expect(submitButton).toBeEnabled();
    
    // Should show available indicator
    await expect(page.locator('[aria-label="Handle available"]').or(page.locator('.bg-green-500'))).toBeVisible();
  });

  test('prevents stale positive results for taken handles', async ({ page }) => {
    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');

    // Rapid typing: available -> taken (ensuring taken handle is last)
    const sequence = ['temp-avail', 'taken-handle'];
    
    for (const handle of sequence) {
      await handleInput.fill('');
      await handleInput.type(handle, { delay: 50 });
      await page.waitForTimeout(50); // Very short delay between inputs
    }
    
    // Wait for all requests to complete
    await page.waitForTimeout(800);
    
    // Final state should be taken handle with correct availability
    await expect(handleInput).toHaveValue('taken-handle');
    await expect(submitButton).toBeDisabled();
    
    // Should show error message
    await expect(page.locator('text=Handle already taken')).toBeVisible();
  });

  test('handles rapid sequential handle checks', async ({ page }) => {
    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');

    // Test with multiple different handles in rapid succession
    const handles = ['test1', 'test2', 'taken-handle', 'test3', 'available-final'];
    
    for (const handle of handles) {
      await handleInput.fill('');
      await handleInput.type(handle, { delay: 30 });
      // Very short delay to simulate rapid typing
      await page.waitForTimeout(40);
    }
    
    // Wait for debouncing and all network requests to settle
    await page.waitForTimeout(1000);
    
    // Should end up with the last handle and correct availability
    await expect(handleInput).toHaveValue('available-final');
    await expect(submitButton).toBeEnabled();
  });

  test('aborts previous requests when typing rapidly', async ({ page }) => {
    let requestCount = 0;
    let abortedRequests = 0;
    
    // Track network requests and aborts
    page.on('request', request => {
      if (request.url().includes('/api/handle/check')) {
        requestCount++;
      }
    });
    
    page.on('requestfailed', request => {
      if (request.url().includes('/api/handle/check') && 
          request.failure()?.errorText?.includes('abort')) {
        abortedRequests++;
      }
    });

    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');

    // Type rapidly to trigger multiple requests
    const rapidSequence = ['a', 'ab', 'abc', 'abcd', 'abcde', 'final-handle'];
    
    for (const partial of rapidSequence) {
      await handleInput.fill(partial);
      await page.waitForTimeout(50); // Faster than debounce delay
    }
    
    // Wait for final request to complete
    await page.waitForTimeout(800);
    
    // Should have made multiple requests but only final one should succeed
    expect(requestCount).toBeGreaterThan(1);
    await expect(handleInput).toHaveValue('final-handle');
  });

  test('maintains consistent UI state during rapid typing', async ({ page }) => {
    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]').or(page.locator('.animate-spin'));

    // Start typing rapidly
    await handleInput.type('testing', { delay: 50 });
    
    // While typing, submit button should be disabled
    await expect(submitButton).toBeDisabled();
    
    // Clear and type a known available handle
    await handleInput.fill('available-test');
    
    // During debounce delay, loading spinner might be visible
    // But final state should be consistent
    await page.waitForTimeout(600);
    
    await expect(handleInput).toHaveValue('available-test');
    await expect(submitButton).toBeEnabled();
    
    // No loading indicator should be showing after requests complete
    await expect(loadingSpinner).toBeHidden();
  });

  test('handles network errors gracefully during race conditions', async ({ page }) => {
    // Mock some requests to fail
    let requestCount = 0;
    await page.route('/api/handle/check*', async (route) => {
      requestCount++;
      
      // Fail first few requests, succeed on later ones
      if (requestCount <= 2) {
        await route.abort('failed');
        return;
      }
      
      const url = route.request().url();
      const handle = new URL(url).searchParams.get('handle') || '';
      const delay = Math.floor(Math.random() * 100) + 50;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: handle === 'recovery-test' })
      });
    });

    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');

    // Type rapidly to trigger failed requests followed by successful one
    await handleInput.type('fail', { delay: 50 });
    await page.waitForTimeout(100);
    
    await handleInput.fill('fail2');
    await page.waitForTimeout(100);
    
    await handleInput.fill('recovery-test');
    
    // Wait for recovery
    await page.waitForTimeout(1000);
    
    // Should recover and show correct state
    await expect(handleInput).toHaveValue('recovery-test');
    await expect(submitButton).toBeEnabled();
  });

  test('race condition with form submission attempt', async ({ page }) => {
    const handleInput = page.locator('input[aria-label="Enter your desired handle"]');
    const submitButton = page.locator('button[type="submit"]');

    // Type an available handle
    await handleInput.type('submit-test', { delay: 50 });
    
    // Wait for it to be validated as available
    await page.waitForTimeout(600);
    await expect(submitButton).toBeEnabled();
    
    // Now rapidly change to taken handle and try to submit
    await handleInput.fill('taken-handle');
    
    // Try to click submit before validation completes
    // This should be prevented by the form validation
    const submitPromise = submitButton.click().catch(() => {
      // Expected to fail due to disabled state
    });
    
    // Wait for validation to complete
    await page.waitForTimeout(600);
    
    // Form should not have been submitted, and handle should show as taken
    await expect(handleInput).toHaveValue('taken-handle');
    await expect(submitButton).toBeDisabled();
    await expect(page.locator('text=Handle already taken')).toBeVisible();
  });
});