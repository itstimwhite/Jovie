import { expect, test } from '@playwright/test';

// Public seed handles from `supabase/seed.sql`
const publicHandles = ['musicmaker', 'popstar', 'techtalks', 'lifestyleguru'];

for (const handle of publicHandles) {
  test.describe(`Public profile: /${handle}`, () => {
    test(`renders and shows primary CTA`, async ({ page }) => {
      // Capture console errors
      const consoleMessages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleMessages.push(msg.text());
      });

      const res = await page.goto(`/${handle}`, {
        waitUntil: 'domcontentloaded',
      });
      expect(res?.ok(), `HTTP status not OK for /${handle}`).toBeTruthy();

      // Title should include the display name or handle in most cases
      await expect(page).toHaveTitle(/.+/);

      // Primary CTA "Listen" should exist somewhere on the page
      const hasListen = await page
        .getByRole('button', { name: /listen/i })
        .first()
        .isVisible()
        .catch(() => false);
      const hasListenLink = await page
        .getByRole('link', { name: /listen/i })
        .first()
        .isVisible()
        .catch(() => false);
      expect(hasListen || hasListenLink).toBeTruthy();

      // No console errors
      expect(
        consoleMessages,
        `Console errors on /${handle}:\n${consoleMessages.join('\n')}`
      ).toHaveLength(0);
    });
  });
}
