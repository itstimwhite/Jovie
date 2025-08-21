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
  });

  // Optional: full flow when properly configured
  // Run only when E2E_ONBOARDING_FULL=1 and environment is set (Clerk + Supabase)
  const runFull = process.env.E2E_ONBOARDING_FULL === '1';
  (runFull ? test : test.skip)(
    'programmatic sign-in → onboarding → dashboard',
    async ({ page }) => {
      test.setTimeout(60_000);

      // Skip if env not properly configured (local defaults from global-setup)
      const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
      const sk = process.env.CLERK_SECRET_KEY || '';
      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supaSrk = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
      if (
        !pk ||
        !sk ||
        !supaUrl ||
        !supaSrk ||
        pk.includes('dummy') ||
        sk.includes('dummy') ||
        supaUrl.includes('dummy') ||
        supaSrk.includes('dummy')
      ) {
        test.skip();
      }

      // 1) Load an unprotected page that initializes Clerk
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // 2) Programmatically sign in with Clerk helper
      // @ts-ignore: optional dev dependency not required for smoke test
      const { clerk } = await import('@clerk/testing/playwright');
      // Prefer configured email; otherwise use a throwaway test address
      const testEmail =
        process.env.E2E_TEST_EMAIL || `playwright+${Date.now()}@example.com`;

      await clerk.signIn({
        page,
        emailAddress: testEmail,
      });

      // 3) Navigate to dashboard — app should redirect to onboarding if needed
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/onboarding/);

      // 4) Fill the onboarding form (handle)
      const handleInput = page.getByLabel('Enter your desired handle');
      await expect(handleInput).toBeVisible();

      const uniqueHandle = `e2e-${Date.now().toString(36)}`;
      await handleInput.fill(uniqueHandle);

      // Wait for debounced availability check and button enablement
      const submit = page.getByRole('button', { name: 'Create Profile' });
      await expect(submit).toBeVisible();

      await expect
        .poll(async () => submit.isEnabled(), {
          timeout: 15_000,
          intervals: [500, 750, 1000],
        })
        .toBe(true);

      // 5) Submit and expect redirect to dashboard
      await Promise.all([page.waitForURL(/\/dashboard/), submit.click()]);

      // 6) Verify dashboard UI loaded
      await expect(
        page.getByRole('heading', { name: 'Dashboard' })
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();
    }
  );
});
