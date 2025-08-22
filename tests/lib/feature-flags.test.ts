import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFeatureFlags, getServerFeatureFlags } from '@/lib/feature-flags';

// Mock fetch for client-side tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Feature Flags', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset window to ensure tests don't interfere with each other
    vi.stubGlobal('window', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getFeatureFlags', () => {
    it('should call getServerFeatureFlags when running on server', async () => {
      // Mock getServerFeatureFlags
      const mockServerFlags = {
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: true,
      };

      vi.mock('@/lib/feature-flags', () => ({
        getFeatureFlags: vi.fn(),
        getServerFeatureFlags: vi.fn().mockResolvedValue(mockServerFlags),
      }));

      // Call getFeatureFlags (should delegate to getServerFeatureFlags)
      const flags = await getFeatureFlags();

      // Verify server flags are returned
      expect(flags).toEqual(mockServerFlags);
    });

    it('should fetch from internal API endpoint on client side', async () => {
      // Setup window to simulate client-side environment
      vi.stubGlobal('window', {});

      // Mock successful API response
      const mockApiResponse = {
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      // Call getFeatureFlags
      const flags = await getFeatureFlags();

      // Verify fetch was called with correct URL
      expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags', {
        cache: 'no-store',
      });

      // Verify flags match the API response
      expect(flags).toEqual(mockApiResponse);
    });

    it('should fall back to Vercel discovery endpoint if internal API fails', async () => {
      // Setup window to simulate client-side environment
      vi.stubGlobal('window', {});

      // Mock failed API response
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      // Mock successful Vercel discovery response
      const mockVercelResponse = {
        version: 4,
        flags: {
          artistSearchEnabled: { default: true },
          debugBannerEnabled: { default: false },
          tipPromoEnabled: { default: true },
          pricingUseClerk: { default: false },
          universalNotificationsEnabled: { default: false },
          featureClickAnalyticsRpc: { default: true },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVercelResponse),
      });

      // Call getFeatureFlags
      const flags = await getFeatureFlags();

      // Verify fetch was called with correct URLs
      expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags', {
        cache: 'no-store',
      });
      expect(mockFetch).toHaveBeenCalledWith('/.well-known/vercel/flags', {
        cache: 'no-store',
      });

      // Verify flags match the expected values from Vercel discovery
      expect(flags).toEqual({
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: true,
      });
    });

    it('should return default flags if all fetches fail', async () => {
      // Setup window to simulate client-side environment
      vi.stubGlobal('window', {});

      // Mock failed API responses
      mockFetch.mockRejectedValueOnce(new Error('API fetch failed'));
      mockFetch.mockRejectedValueOnce(
        new Error('Vercel discovery fetch failed')
      );

      // Call getFeatureFlags
      const flags = await getFeatureFlags();

      // Verify default flags are returned
      expect(flags).toEqual({
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: expect.any(Boolean),
        featureClickAnalyticsRpc: false,
      });
    });
  });

  describe('getServerFeatureFlags', () => {
    it('should fetch from internal API endpoint on server side', async () => {
      // Mock headers
      const mockHeaders = {
        get: vi.fn((key) => {
          if (key === 'host') return 'example.com';
          if (key === 'x-forwarded-proto') return 'https';
          return null;
        }),
      };

      vi.mock('next/headers', () => ({
        headers: () => mockHeaders,
      }));

      // Mock successful API response
      const mockApiResponse = {
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      // Call getServerFeatureFlags
      const flags = await getServerFeatureFlags();

      // Verify fetch was called with correct URL
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/feature-flags',
        { cache: 'no-store' }
      );

      // Verify flags match the API response
      expect(flags).toEqual(mockApiResponse);
    });

    it('should fall back to Vercel discovery endpoint if internal API fails', async () => {
      // Mock headers
      const mockHeaders = {
        get: vi.fn((key) => {
          if (key === 'host') return 'example.com';
          if (key === 'x-forwarded-proto') return 'https';
          return null;
        }),
      };

      vi.mock('next/headers', () => ({
        headers: () => mockHeaders,
      }));

      // Mock failed API response
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      // Mock successful Vercel discovery response
      const mockVercelResponse = {
        version: 4,
        flags: {
          artistSearchEnabled: { default: true },
          debugBannerEnabled: { default: false },
          tipPromoEnabled: { default: true },
          pricingUseClerk: { default: false },
          universalNotificationsEnabled: { default: false },
          featureClickAnalyticsRpc: { default: true },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVercelResponse),
      });

      // Call getServerFeatureFlags
      const flags = await getServerFeatureFlags();

      // Verify fetch was called with correct URLs
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api/feature-flags',
        { cache: 'no-store' }
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/.well-known/vercel/flags',
        { cache: 'no-store' }
      );

      // Verify flags match the expected values from Vercel discovery
      expect(flags).toEqual({
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: true,
      });
    });

    it('should return default flags if all fetches fail', async () => {
      // Mock headers
      const mockHeaders = {
        get: vi.fn((key) => {
          if (key === 'host') return 'example.com';
          if (key === 'x-forwarded-proto') return 'https';
          return null;
        }),
      };

      vi.mock('next/headers', () => ({
        headers: () => mockHeaders,
      }));

      // Mock failed API responses
      mockFetch.mockRejectedValueOnce(new Error('API fetch failed'));
      mockFetch.mockRejectedValueOnce(
        new Error('Vercel discovery fetch failed')
      );

      // Call getServerFeatureFlags
      const flags = await getServerFeatureFlags();

      // Verify default flags are returned
      expect(flags).toEqual({
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: expect.any(Boolean),
        featureClickAnalyticsRpc: false,
      });
    });

    it('should return default flags if headers are not available', async () => {
      // Mock headers to return null for host
      const mockHeaders = {
        get: vi.fn(() => null),
      };

      vi.mock('next/headers', () => ({
        headers: () => mockHeaders,
      }));

      // Call getServerFeatureFlags
      const flags = await getServerFeatureFlags();

      // Verify default flags are returned without making any fetch calls
      expect(mockFetch).not.toHaveBeenCalled();
      expect(flags).toEqual({
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: expect.any(Boolean),
        featureClickAnalyticsRpc: false,
      });
    });
  });
});
