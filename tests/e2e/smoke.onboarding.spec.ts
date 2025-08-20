import { test, expect } from '@playwright/test';

// Minimal onboarding smoke: unauthenticated users should be redirected to sign-in
// This is deterministic and requires no external inbox/service.

test.describe('Onboarding smoke', () => {
  test('unauthenticated /dashboard redirects to /sign-in', async ({ page }) => {
    const res = await page.goto('/dashboard', {
      waitUntil: 'domcontentloaded',
    });
    // Should land on sign-in
    await expect(page).toHaveURL(/\/sign-in/);
    expect(res?.ok(), 'Expected the sign-in page to respond OK').toBeTruthy();

    // Basic sanity checks on sign-in UI
    const hasSignIn = await page
      .getByText(/sign in/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(hasSignIn).toBeTruthy();
  });

  // Optional: future full flow when E2E inbox is available
  // Run only when E2E_ONBOARDING_FULL=1 and mailbox is configured
  const runFull = process.env.E2E_ONBOARDING_FULL === '1';
  (runFull ? test : test.skip)(
    'full sign-up → claim handle → dashboard (placeholder)',
    async () => {
      // Implement when test inbox is available.
      // For now, this is intentionally skipped unless explicitly enabled.
      expect(true).toBeTruthy();
    }
  );
});
