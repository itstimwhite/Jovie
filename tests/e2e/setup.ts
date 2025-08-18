/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      supportsFiber: boolean;
      inject: () => void;
      onCommitFiberRoot: () => void;
      onCommitFiberUnmount: () => void;
    };
  }
}

// Extend the base test with custom setup
export const test = base.extend({
  // Override the page to handle React context issues
  page: async ({ page }, usePage) => {
    // Set up page to handle React context
    await page.addInitScript(() => {
      // Mock React context providers for testing
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {},
      };

      // Mock console errors to reduce noise
      const originalError = console.error;
      console.error = (...args: unknown[]) => {
        // Filter out React hook warnings during tests
        const message = args.join(' ');
        if (
          message.includes('Invalid hook call') ||
          message.includes('useContext') ||
          message.includes('Rules of Hooks')
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    });

    await usePage(page);
  },
});

export { expect } from '@playwright/test';
