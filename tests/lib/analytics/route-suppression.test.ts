import { describe, it, expect } from 'vitest';
import { shouldSuppressAnalytics } from '../../../lib/analytics/route-suppression';

describe('Route Suppression', () => {
  describe('shouldSuppressAnalytics', () => {
    it('should suppress /go/* routes', () => {
      expect(shouldSuppressAnalytics('/go/spotify')).toBe(true);
      expect(shouldSuppressAnalytics('/go/twitter')).toBe(true);
      expect(shouldSuppressAnalytics('/go/123')).toBe(true);
      expect(shouldSuppressAnalytics('/go/')).toBe(true);
    });

    it('should suppress /out/* routes', () => {
      expect(shouldSuppressAnalytics('/out/link')).toBe(true);
      expect(shouldSuppressAnalytics('/out/external')).toBe(true);
      expect(shouldSuppressAnalytics('/out/123')).toBe(true);
      expect(shouldSuppressAnalytics('/out/')).toBe(true);
    });

    it('should suppress /api/* routes', () => {
      expect(shouldSuppressAnalytics('/api/users')).toBe(true);
      expect(shouldSuppressAnalytics('/api/auth')).toBe(true);
      expect(shouldSuppressAnalytics('/api/data/123')).toBe(true);
      expect(shouldSuppressAnalytics('/api/')).toBe(true);
    });

    it('should suppress error pages based on status code', () => {
      expect(shouldSuppressAnalytics('/any-path', 404)).toBe(true);
      expect(shouldSuppressAnalytics('/any-path', 500)).toBe(true);
      expect(shouldSuppressAnalytics('/any-path', 502)).toBe(true);
      expect(shouldSuppressAnalytics('/any-path', 503)).toBe(true);
    });

    it('should not suppress normal routes', () => {
      expect(shouldSuppressAnalytics('/')).toBe(false);
      expect(shouldSuppressAnalytics('/home')).toBe(false);
      expect(shouldSuppressAnalytics('/profile')).toBe(false);
      expect(shouldSuppressAnalytics('/settings')).toBe(false);
      expect(shouldSuppressAnalytics('/going-somewhere')).toBe(false);
      expect(shouldSuppressAnalytics('/outside')).toBe(false);
      expect(shouldSuppressAnalytics('/apis-documentation')).toBe(false);
    });

    it('should not suppress normal routes with normal status codes', () => {
      expect(shouldSuppressAnalytics('/home', 200)).toBe(false);
      expect(shouldSuppressAnalytics('/profile', 200)).toBe(false);
      expect(shouldSuppressAnalytics('/profile', 201)).toBe(false);
      expect(shouldSuppressAnalytics('/profile', 301)).toBe(false);
      expect(shouldSuppressAnalytics('/profile', 302)).toBe(false);
    });
  });
});
