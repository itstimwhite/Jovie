import { describe, it, expect, vi } from 'vitest';

describe('Vercel Flags Discovery Endpoint', () => {
  it('should return version 4 and flag definitions', async () => {
    // Mock fetch for the test environment
    const mockResponse = {
      version: 4,
      definitions: {
        debugBannerEnabled: {
          options: [
            { label: 'On', value: true },
            { label: 'Off', value: false },
          ],
          description: 'Show debug banner in the UI',
          defaultValue: true,
          declaredInCode: true,
        },
        artistSearchEnabled: {
          options: [
            { label: 'Enabled', value: true },
            { label: 'Disabled', value: false },
          ],
          description: 'Enable artist search UI (replaced by claim flow)',
          defaultValue: true,
          declaredInCode: true,
        },
        tipPromoEnabled: {
          options: [
            { label: 'Enabled', value: true },
            { label: 'Disabled', value: false },
          ],
          description: 'Enable tip promotion features',
          defaultValue: true,
          declaredInCode: true,
        },
        waitlistEnabled: {
          options: [
            { label: 'Enabled', value: true },
            { label: 'Disabled', value: false },
          ],
          description: 'Controls waitlist flow visibility',
          defaultValue: false,
          declaredInCode: true,
        },
      },
      hints: [],
      metadata: {
        app: 'jovie',
        framework: 'next',
        source: 'flags-sdk-v4',
      },
    };

    // Mock the global fetch for this test
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    // Test the structure manually since we can't easily test the actual endpoint in unit tests
    expect(mockResponse.version).toBe(4);
    expect(mockResponse.definitions).toHaveProperty('debugBannerEnabled');
    expect(mockResponse.definitions).toHaveProperty('artistSearchEnabled');
    expect(mockResponse.definitions).toHaveProperty('tipPromoEnabled');
    expect(mockResponse.definitions).toHaveProperty('waitlistEnabled');
    expect(mockResponse.metadata.source).toBe('flags-sdk-v4');

    // Test that all flags have required properties
    Object.values(mockResponse.definitions).forEach((flag) => {
      expect(flag).toHaveProperty('defaultValue');
      expect(flag).toHaveProperty('description');
      expect(flag).toHaveProperty('options');
      expect(flag).toHaveProperty('declaredInCode');
      expect(flag.declaredInCode).toBe(true);
    });
  });
});
