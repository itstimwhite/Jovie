import { describe, it, expect, beforeEach } from 'vitest';
import { filterSensitiveQueryParams } from '../../../lib/analytics/query-param-filter';

describe('Query Parameter Filtering', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://jov.ie',
      },
      writable: true,
    });
  });

  describe('filterSensitiveQueryParams', () => {
    it('should filter out sensitive query parameters', () => {
      const url = '/profile?token=abc123&name=john';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile?name=john');
    });

    it('should filter out multiple sensitive query parameters', () => {
      const url =
        '/profile?token=abc123&password=secret&email=test@example.com&name=john';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile?name=john');
    });

    it('should handle URLs with no query parameters', () => {
      const url = '/profile';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile');
    });

    it('should handle URLs with only sensitive query parameters', () => {
      const url = '/profile?token=abc123&password=secret';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile');
    });

    it('should preserve hash fragments', () => {
      const url = '/profile?token=abc123&name=john#section1';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile?name=john#section1');
    });

    it('should handle absolute URLs', () => {
      const url = 'https://jov.ie/profile?token=abc123&name=john';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe('/profile?name=john');
    });

    it('should handle errors gracefully', () => {
      // Create an invalid URL that will cause an error
      const url = ':invalid-url';
      const filtered = filterSensitiveQueryParams(url);
      expect(filtered).toBe(':invalid-url');
    });
  });
});
