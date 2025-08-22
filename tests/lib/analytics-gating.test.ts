import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track, page, identify } from '@/lib/analytics';
import { ANALYTICS } from '@/constants/app';

// Mock posthog
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    register: vi.fn(),
  },
}));

describe('Analytics Gating', () => {
  // Save original window and posthog key
  const originalWindow = global.window;
  const originalPosthogKey = ANALYTICS.posthogKey;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock window
    global.window = Object.assign({}, originalWindow, {
      location: {
        hostname: 'example.com',
        pathname: '/test',
      },
      va: vi.fn(),
      gtag: vi.fn(),
    }) as Window & typeof globalThis;
  });

  afterEach(() => {
    // Restore window
    global.window = originalWindow;

    // Restore ANALYTICS.posthogKey
    Object.defineProperty(ANALYTICS, 'posthogKey', {
      value: originalPosthogKey,
      writable: true,
    });
  });

  describe('track function', () => {
    it('should not call posthog.capture when posthogKey is not set', () => {
      // Set posthogKey to empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: '',
        writable: true,
      });

      // Call track
      track('test_event', { property: 'value' });

      // Import posthog to verify it wasn't called
      const posthog = require('posthog-js').default;

      // Verify posthog.capture was not called
      expect(posthog.capture).not.toHaveBeenCalled();

      // Verify other analytics services were still called
      expect(window.va).toHaveBeenCalledWith('event', {
        name: 'test_event',
        properties: { property: 'value', env: expect.any(String) },
      });
      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        property: 'value',
        env: expect.any(String),
      });
    });

    it('should call posthog.capture when posthogKey is set', () => {
      // Set posthogKey to a non-empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: 'test_key',
        writable: true,
      });

      // Call track
      track('test_event', { property: 'value' });

      // Import posthog to verify it was called
      const posthog = require('posthog-js').default;

      // Verify posthog.capture was called
      expect(posthog.capture).toHaveBeenCalledWith('test_event', {
        property: 'value',
      });
    });
  });

  describe('page function', () => {
    it('should not call posthog.capture when posthogKey is not set', () => {
      // Set posthogKey to empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: '',
        writable: true,
      });

      // Call page
      page('test_page', { property: 'value' });

      // Import posthog to verify it wasn't called
      const posthog = require('posthog-js').default;

      // Verify posthog.capture was not called
      expect(posthog.capture).not.toHaveBeenCalled();

      // Verify other analytics services were still called
      expect(window.va).toHaveBeenCalledWith('page_view', {
        name: 'test_page',
        properties: { property: 'value', env: expect.any(String) },
      });
    });

    it('should call posthog.capture when posthogKey is set', () => {
      // Set posthogKey to a non-empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: 'test_key',
        writable: true,
      });

      // Call page
      page('test_page', { property: 'value' });

      // Import posthog to verify it was called
      const posthog = require('posthog-js').default;

      // Verify posthog.capture was called with $pageview
      expect(posthog.capture).toHaveBeenCalledWith('$pageview', {
        name: 'test_page',
        url: '/test',
        property: 'value',
      });
    });
  });

  describe('identify function', () => {
    it('should not call posthog.identify when posthogKey is not set', () => {
      // Set posthogKey to empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: '',
        writable: true,
      });

      // Call identify
      identify('user123', { trait: 'value' });

      // Import posthog to verify it wasn't called
      const posthog = require('posthog-js').default;

      // Verify posthog.identify was not called
      expect(posthog.identify).not.toHaveBeenCalled();

      // Verify other analytics services were still called
      expect(window.va).toHaveBeenCalledWith('identify', {
        userId: 'user123',
        traits: { trait: 'value' },
      });
    });

    it('should call posthog.identify when posthogKey is set', () => {
      // Set posthogKey to a non-empty string
      Object.defineProperty(ANALYTICS, 'posthogKey', {
        value: 'test_key',
        writable: true,
      });

      // Call identify
      identify('user123', { trait: 'value' });

      // Import posthog to verify it was called
      const posthog = require('posthog-js').default;

      // Verify posthog.identify was called
      expect(posthog.identify).toHaveBeenCalledWith('user123', {
        trait: 'value',
      });
    });
  });
});
