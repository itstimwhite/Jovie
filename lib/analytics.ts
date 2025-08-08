'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';
import { ANALYTICS } from '@/constants/app';

// Type definitions for analytics
interface MockAnalytics {
  track: (event: string, properties?: Record<string, unknown>) => Promise<void>;
  page: (name?: string, properties?: Record<string, unknown>) => Promise<void>;
  identify: (userId: string, traits?: Record<string, unknown>) => Promise<void>;
}

// Extend window interface for analytics
declare global {
  interface Window {
    va?: (event: string, data: Record<string, unknown>) => void;
    gtag?: (
      command: string,
      event: string,
      properties?: Record<string, unknown>
    ) => void;
  }
}

let analytics: AnalyticsBrowser | MockAnalytics;

if (typeof window !== 'undefined' && ANALYTICS.segmentWriteKey) {
  analytics = AnalyticsBrowser.load({
    writeKey: ANALYTICS.segmentWriteKey,
  });
} else {
  analytics = {
    track: () => Promise.resolve(),
    page: () => Promise.resolve(),
    identify: () => Promise.resolve(),
  } as MockAnalytics;
}

export { analytics };

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.track(event, properties);

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('event', {
        name: event,
        properties,
      });
    }

    // Track with Google Analytics (if available)
    if (window.gtag) {
      window.gtag('event', event, properties);
    }
  }
}

export function page(name?: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.page(name, properties);

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('page_view', {
        name,
        properties,
      });
    }
  }
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.identify(userId, traits);

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('identify', {
        userId,
        traits,
      });
    }
  }
}
