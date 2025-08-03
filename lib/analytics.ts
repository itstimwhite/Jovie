'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';
import { ANALYTICS } from '@/constants/app';

let analytics: AnalyticsBrowser;

if (typeof window !== 'undefined' && ANALYTICS.segmentWriteKey) {
  analytics = AnalyticsBrowser.load({
    writeKey: ANALYTICS.segmentWriteKey,
  });
} else {
  analytics = {
    track: () => Promise.resolve(),
    page: () => Promise.resolve(),
    identify: () => Promise.resolve(),
  } as any;
}

export { analytics };

export function track(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.track(event, properties);
    
    // Track with Vercel Analytics (if available)
    if ((window as any).va) {
      (window as any).va('event', {
        name: event,
        properties,
      });
    }
    
    // Track with Google Analytics (if available)
    if ((window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
  }
}

export function page(name?: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.page(name, properties);
    
    // Track with Vercel Analytics (if available)
    if ((window as any).va) {
      (window as any).va('page_view', {
        name,
        properties,
      });
    }
  }
}

export function identify(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track with Segment
    analytics.identify(userId, traits);
    
    // Track with Vercel Analytics (if available)
    if ((window as any).va) {
      (window as any).va('identify', {
        userId,
        traits,
      });
    }
  }
}
