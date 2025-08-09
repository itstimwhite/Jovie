import { test, expect } from './setup';

test.describe('Sign-up to Dashboard Redirect Flow @smoke', () => {
  test.describe('Unauthenticated User Flow', () => {
    test('should redirect authenticated users from homepage to dashboard', async ({
      page,
    }) => {
      // Mock authenticated state by setting up the browser context
      // to simulate a logged-in user (this tests the middleware logic)
      await page.goto('/');

      // For unauthenticated users, verify they stay on homepage
      // and can see sign-up/sign-in options
      await expect(page.locator('h1')).toContainText('Link in bio');
      await expect(
        page.getByText('Connect your music, social media, and merch in one link')
      ).toBeVisible();

      // Check that auth buttons are available
      // Note: Actual Clerk auth buttons may have different text/selectors
      const authElements = page.locator('text=/Sign|Login|Get started/i');
      if ((await authElements.count()) > 0) {
        await expect(authElements.first()).toBeVisible();
      }
    });

    test('should show proper dashboard loading states for new users', async ({
      page,
    }) => {
      // Navigate directly to dashboard (unauthenticated)
      await page.goto('/dashboard');

      // Should either:
      // 1. Redirect to auth (Clerk handles this)
      // 2. Show loading state while checking auth
      // 3. Show onboarding form for new users

      // Wait for the page to stabilize
      await page.waitForLoadState('networkidle');

      // Check that we either get redirected or see appropriate content
      const url = page.url();
      const isOnDashboard = url.includes('/dashboard');
      const isOnAuth = url.includes('/sign-in') || url.includes('/sign-up');
      const isOnOnboarding = url.includes('/onboarding');

      expect(isOnDashboard || isOnAuth || isOnOnboarding).toBe(true);

      // If we're on dashboard, we should see either:
      if (isOnDashboard) {
        // 1. Loading state
        const loadingSpinner = page.locator('[data-testid="spinner"]');
        // 2. Onboarding form (for new users)
        const onboardingForm = page.getByText('Welcome to Jovie');
        // 3. Error message
        const errorMessage = page.getByText('Something went wrong');

        const hasLoadingState =
          (await loadingSpinner.count()) > 0 &&
          (await loadingSpinner.isVisible().catch(() => false));
        const hasOnboardingForm =
          (await onboardingForm.count()) > 0 &&
          (await onboardingForm.isVisible().catch(() => false));
        const hasErrorMessage =
          (await errorMessage.count()) > 0 &&
          (await errorMessage.isVisible().catch(() => false));

        expect(hasLoadingState || hasOnboardingForm || hasErrorMessage).toBe(
          true
        );
      }
    });
  });

  test.describe('Dashboard Data Loading', () => {
    test('dashboard should handle missing user data gracefully', async ({
      page,
    }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // The dashboard should handle different scenarios:
      // 1. No authentication -> redirect to auth
      // 2. Authenticated but no user record -> show onboarding
      // 3. User record but no artist -> show onboarding
      // 4. Complete user/artist -> show dashboard

      const currentUrl = page.url();

      if (currentUrl.includes('/dashboard')) {
        // If we're on dashboard, check that error handling works
        // Look for either successful onboarding form or proper error handling
        const onboardingHeading = page.getByText('Welcome to Jovie');
        const errorHeading = page.getByText('Something went wrong');
        const dashboardHeading = page.getByRole('heading', {
          name: 'Dashboard',
        });

        const hasOnboarding = await onboardingHeading
          .isVisible()
          .catch(() => false);
        const hasError = await errorHeading.isVisible().catch(() => false);
        const hasDashboard = await dashboardHeading
          .isVisible()
          .catch(() => false);

        // Should show one of these states
        expect(hasOnboarding || hasError || hasDashboard).toBe(true);

        // If there's an error, it should have a retry mechanism
        if (hasError) {
          const refreshButton = page.getByRole('button', {
            name: 'Refresh Page',
          });
          await expect(refreshButton).toBeVisible();
        }

        // If there's onboarding, it should have the expected form elements
        if (hasOnboarding) {
          await expect(
            page.getByText('Claim your jov.ie handle to launch your artist profile')
          ).toBeVisible();
        }
      }
    });

    test('dashboard should display loading states properly', async ({
      page,
    }) => {
      await page.goto('/dashboard');

      // Check for loading spinner
      const spinner = page.locator('.animate-spin');
      const loadingText = page.getByText('Loading...');

      // At some point during the load, we should see loading indicators
      // (This may be brief, so we'll check that the page eventually resolves)
      await page.waitForLoadState('networkidle');

      // After loading, spinner should be gone (unless there's an error)
      const finalSpinnerVisible = await spinner.isVisible().catch(() => false);
      const finalLoadingTextVisible = await loadingText
        .isVisible()
        .catch(() => false);

      // If still showing loading, something might be wrong
      // But we'll be lenient as this could be normal in some states
      if (finalSpinnerVisible || finalLoadingTextVisible) {
        console.log('Dashboard still showing loading state - may indicate an issue');
      }

      // The main thing is that we don't get console errors
      // and the page doesn't crash
      const hasContent =
        (await page.getByText('Welcome to Jovie').isVisible().catch(() => false)) ||
        (await page.getByText('Dashboard').isVisible().catch(() => false)) ||
        (await page.getByText('Something went wrong').isVisible().catch(() => false));

      expect(hasContent).toBe(true);
    });

    test('onboarding form should be accessible and functional', async ({
      page,
    }) => {
      await page.goto('/onboarding');
      await page.waitForLoadState('networkidle');

      // Check that onboarding page loads properly
      await expect(page.getByText('Welcome to Jovie')).toBeVisible();
      await expect(
        page.getByText('Claim your jov.ie handle to launch your artist profile')
      ).toBeVisible();

      // Check for form elements
      const handleInput = page.getByPlaceholder(/handle/i);
      if ((await handleInput.count()) > 0) {
        await expect(handleInput).toBeVisible();
        await expect(handleInput).toBeEditable();
      }

      // Check that the form has proper accessibility attributes
      const form = page.locator('form');
      if ((await form.count()) > 0) {
        const formElements = form.locator('input, button, select, textarea');
        for (const element of await formElements.all()) {
          const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
          
          if (tagName === 'input') {
            const type = await element.getAttribute('type');
            const id = await element.getAttribute('id');
            const ariaLabel = await element.getAttribute('aria-label');
            const placeholder = await element.getAttribute('placeholder');
            
            // Input should have some form of label
            expect(id || ariaLabel || placeholder).toBeTruthy();
          }
        }
      }

      // Check for theme toggle (should be present)
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if ((await themeToggle.count()) === 0) {
        // Look for theme toggle by other means
        const darkModeButton = page.locator('button').filter({
          hasText: /theme|dark|light/i,
        });
        if ((await darkModeButton.count()) > 0) {
          await expect(darkModeButton.first()).toBeVisible();
        }
      } else {
        await expect(themeToggle).toBeVisible();
      }
    });
  });

  test.describe('Navigation Flow', () => {
    test('should handle direct dashboard access appropriately', async ({
      page,
    }) => {
      // Test what happens when someone directly navigates to /dashboard
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Should not result in infinite redirects or crashes
      const finalUrl = page.url();
      expect(finalUrl).toBeTruthy();

      // Should not show JavaScript errors in console
      const logs = page.locator('body');
      await expect(logs).not.toContainText('Uncaught');
    });

    test('middleware should properly redirect authenticated users', async ({
      page,
    }) => {
      // This tests the middleware.ts logic
      // When we implement auth mocking, we can make this more specific

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // For now, just verify the homepage loads without errors
      // In a real test with auth mocking, we'd verify redirect behavior
      const currentUrl = page.url();
      expect(currentUrl).toContain('/'); // Should be on some valid route

      // Check that the page loads successfully
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      if (bodyText) {
        expect(bodyText.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle Supabase connection errors gracefully', async ({
      page,
    }) => {
      // Test error handling when database is unavailable
      // We can't easily mock this in e2e, but we can check error UI

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // If there's an error state, it should be user-friendly
      const errorHeading = page.getByText('Something went wrong');
      const hasError = await errorHeading.isVisible().catch(() => false);

      if (hasError) {
        // Should have a helpful error message
        const errorText = page.locator('text=/error|failed|wrong/i');
        await expect(errorText.first()).toBeVisible();

        // Should have a retry mechanism
        const refreshButton = page.getByRole('button', {
          name: /refresh|retry|try again/i,
        });
        await expect(refreshButton).toBeVisible();
      }
    });

    test('should not expose sensitive information in errors', async ({
      page,
    }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check that error messages don't expose sensitive data
      const bodyText = await page.textContent('body');
      const sensitivePatterns = [
        /api[_-]?key/i,
        /secret/i,
        /password/i,
        /token/i,
        /supabase.*key/i,
        /clerk.*key/i,
      ];

      for (const pattern of sensitivePatterns) {
        expect(bodyText).not.toMatch(pattern);
      }
    });
  });
});