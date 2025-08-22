import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { GET } from '@/app/api/feature-flags/route';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: any) => ({ data })),
  },
}));

describe('Feature Flags API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Clear all feature flag environment variables
    delete process.env.FEATURE_ARTIST_SEARCH;
    delete process.env.FEATURE_DEBUG_BANNER;
    delete process.env.NEXT_PUBLIC_FEATURE_TIPS;
    delete process.env.FEATURE_PRICING_USE_CLERK;
    delete process.env.FEATURE_UNIVERSAL_NOTIFICATIONS;
    delete process.env.FEATURE_CLICK_ANALYTICS_RPC;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default values when no environment variables are set', async () => {
    const response = await GET();
    const data = await response.json();

    // Check camelCase keys
    expect(data.artistSearchEnabled).toBe(true);
    expect(data.debugBannerEnabled).toBe(false);
    expect(data.tipPromoEnabled).toBe(true);
    expect(data.pricingUseClerk).toBe(false);
    expect(data.featureClickAnalyticsRpc).toBe(false);

    // Check snake_case aliases
    expect(data.artist_search_enabled).toBe(true);
    expect(data.debug_banner_enabled).toBe(false);
    expect(data.tip_promo_enabled).toBe(true);
    expect(data.pricing_use_clerk).toBe(false);
    expect(data.feature_click_analytics_rpc).toBe(false);
  });

  it('should override default values with environment variables', async () => {
    // Set environment variables
    process.env.FEATURE_ARTIST_SEARCH = 'false';
    process.env.FEATURE_DEBUG_BANNER = 'true';
    process.env.NEXT_PUBLIC_FEATURE_TIPS = 'false';
    process.env.FEATURE_PRICING_USE_CLERK = 'true';
    process.env.FEATURE_CLICK_ANALYTICS_RPC = 'true';

    const response = await GET();
    const data = await response.json();

    // Check camelCase keys
    expect(data.artistSearchEnabled).toBe(false);
    expect(data.debugBannerEnabled).toBe(true);
    expect(data.tipPromoEnabled).toBe(false);
    expect(data.pricingUseClerk).toBe(true);
    expect(data.featureClickAnalyticsRpc).toBe(true);

    // Check snake_case aliases
    expect(data.artist_search_enabled).toBe(false);
    expect(data.debug_banner_enabled).toBe(true);
    expect(data.tip_promo_enabled).toBe(false);
    expect(data.pricing_use_clerk).toBe(true);
    expect(data.feature_click_analytics_rpc).toBe(true);
  });

  it('should handle mixed case in environment variable values', async () => {
    // Set environment variables with mixed case
    process.env.FEATURE_ARTIST_SEARCH = 'TRUE';
    process.env.FEATURE_DEBUG_BANNER = 'True';
    process.env.NEXT_PUBLIC_FEATURE_TIPS = 'FALSE';
    process.env.FEATURE_PRICING_USE_CLERK = 'False';

    const response = await GET();
    const data = await response.json();

    // Check values are correctly parsed regardless of case
    expect(data.artistSearchEnabled).toBe(true);
    expect(data.debugBannerEnabled).toBe(true);
    expect(data.tipPromoEnabled).toBe(false);
    expect(data.pricingUseClerk).toBe(false);
  });

  it('should handle invalid boolean values in environment variables', async () => {
    // Set environment variables with invalid values
    process.env.FEATURE_ARTIST_SEARCH = 'yes'; // Not 'true' or 'false'
    process.env.FEATURE_DEBUG_BANNER = '1'; // Not 'true' or 'false'

    const response = await GET();
    const data = await response.json();

    // Invalid values should be treated as false
    expect(data.artistSearchEnabled).toBe(false);
    expect(data.debugBannerEnabled).toBe(false);
  });

  it('should include all expected flag properties', async () => {
    const response = await GET();
    const data = await response.json();

    // Check that all expected properties exist
    const expectedCamelCaseKeys = [
      'artistSearchEnabled',
      'debugBannerEnabled',
      'tipPromoEnabled',
      'pricingUseClerk',
      'universalNotificationsEnabled',
      'featureClickAnalyticsRpc',
    ];

    const expectedSnakeCaseKeys = [
      'artist_search_enabled',
      'debug_banner_enabled',
      'tip_promo_enabled',
      'pricing_use_clerk',
      'universal_notifications_enabled',
      'feature_click_analytics_rpc',
    ];

    expectedCamelCaseKeys.forEach((key) => {
      expect(data).toHaveProperty(key);
      expect(typeof data[key]).toBe('boolean');
    });

    expectedSnakeCaseKeys.forEach((key) => {
      expect(data).toHaveProperty(key);
      expect(typeof data[key]).toBe('boolean');
    });
  });
});
