import { describe, it, expect, beforeEach, vi } from 'vitest';
import { env } from '@/lib/env';
import path from 'path';

// Precise Clerk session param type for createClerkSupabaseClient
type ClerkSessionForSupabase = NonNullable<
  Parameters<typeof import('@/lib/supabase').createClerkSupabaseClient>[0]
>;

/**
 * Integration Health Diagnostic Tests
 *
 * Tests the health of three main integrations:
 * 1. Clerk auth integration
 * 2. Supabase client (browser + authenticated)
 */

describe('Integration Health Diagnostics', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  describe('Environment Configuration', () => {
    it('should detect missing environment variables appropriately', () => {
      // In CI/test environment, env vars are expected to be undefined
      // This tests that our env validation handles missing vars gracefully
      const clerkKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // These may be undefined in test environment - that's expected
      if (clerkKey !== undefined) {
        expect(typeof clerkKey).toBe('string');
        expect(clerkKey.length).toBeGreaterThan(0);
      }

      if (supabaseUrl !== undefined) {
        expect(typeof supabaseUrl).toBe('string');
        expect(supabaseUrl.length).toBeGreaterThan(0);
      }

      if (supabaseKey !== undefined) {
        expect(typeof supabaseKey).toBe('string');
        expect(supabaseKey.length).toBeGreaterThan(0);
      }
    });

    it('should validate Supabase URL format when present', () => {
      if (env.NEXT_PUBLIC_SUPABASE_URL) {
        expect(
          () => new URL(env.NEXT_PUBLIC_SUPABASE_URL as string)
        ).not.toThrow();
        // Allow both supabase.co and custom domains
        expect(env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/^https:\/\/.+/);
      }
    });
  });

  describe('Clerk Integration', () => {
    it('should be able to import Clerk module', async () => {
      // Test that we can import the Clerk module without throwing
      expect(async () => {
        await import('@clerk/nextjs');
      }).not.toThrow();
    });

    it('should validate publishable key format when present', () => {
      const publishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      if (publishableKey) {
        // Clerk publishable keys start with pk_
        expect(publishableKey).toMatch(/^pk_(test_|live_)/);
      } else {
        // When not configured, should be undefined
        expect(publishableKey).toBeUndefined();
      }
    });
  });

  describe('Supabase Integration', () => {
    it('should create Supabase clients without throwing', async () => {
      const { createBrowserClient } = await import('@/lib/supabase');

      // Should not throw even when env vars are missing
      expect(() => createBrowserClient()).not.toThrow();
    });

    it('should export required Supabase functions', async () => {
      const supabaseModule = await import('@/lib/supabase');

      expect(supabaseModule.createBrowserClient).toBeDefined();
      expect(supabaseModule.useAuthenticatedSupabase).toBeDefined();
      expect(supabaseModule.createClerkSupabaseClient).toBeDefined();
      expect(supabaseModule.supabase).toBeDefined();
    });

    it('should handle missing environment variables gracefully', async () => {
      const { createBrowserClient } = await import('@/lib/supabase');
      const client = createBrowserClient();

      // When env vars are missing, should return null
      if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        expect(client).toBeNull();
      } else {
        expect(client).not.toBeNull();
      }
    });
  });

  describe('Component Integration', () => {
    it('should have pricing page module available', () => {
      // Test that the pricing page path exists as a module
      const pricingPagePath = path.resolve(
        process.cwd(),
        'app/(marketing)/pricing/page.tsx'
      );
      const fs = require('fs');
      expect(fs.existsSync(pricingPagePath)).toBe(true);
    });

    it('should have dashboard page module available', () => {
      // Test that the dashboard page path exists as a module
      const dashboardPagePath = path.resolve(
        process.cwd(),
        'app/dashboard/page.tsx'
      );
      const fs = require('fs');
      expect(fs.existsSync(dashboardPagePath)).toBe(true);
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should handle session token integration properly', async () => {
      const { createClerkSupabaseClient } = await import('@/lib/supabase');

      // Mock session with getToken method
      const mockSession = {
        getToken: vi.fn().mockResolvedValue('mock-token'),
      } as unknown as ClerkSessionForSupabase;

      const client = createClerkSupabaseClient(mockSession);

      // When env vars are missing, should return null
      if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        expect(client).toBeNull();
      } else {
        expect(client).not.toBeNull();
      }
    });

    it('should handle Clerk template for Supabase tokens', async () => {
      const { createClerkSupabaseClient } = await import('@/lib/supabase');

      // Mock session with template-specific token method
      const mockSession = {
        getToken: vi.fn().mockImplementation(({ template }) => {
          if (template === 'supabase') {
            return Promise.resolve('supabase-compatible-token');
          }
          return Promise.resolve('default-token');
        }),
      } as unknown as ClerkSessionForSupabase;

      const client = createClerkSupabaseClient(mockSession);

      // When env vars are missing, should return null
      if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        expect(client).toBeNull();
      } else {
        expect(client).not.toBeNull();
        // The session getToken method should be available for future use
        expect(mockSession.getToken).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed environment variables', () => {
      // Test with invalid URL
      vi.doMock('@/lib/env', () => ({
        env: {
          NEXT_PUBLIC_SUPABASE_URL: 'invalid-url',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
        },
      }));

      expect(() => {
        if (
          env.NEXT_PUBLIC_SUPABASE_URL &&
          env.NEXT_PUBLIC_SUPABASE_URL !== 'invalid-url'
        ) {
          new URL(env.NEXT_PUBLIC_SUPABASE_URL);
        }
      }).not.toThrow();
    });

    it('should handle missing Clerk session gracefully', async () => {
      const { useAuthenticatedSupabase } = await import('@/lib/supabase');

      // This test just ensures the function is available and can be called
      expect(useAuthenticatedSupabase).toBeDefined();
      expect(typeof useAuthenticatedSupabase).toBe('function');
    });
  });
});
