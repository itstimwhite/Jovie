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
    analytics.track(event, properties);
  }
}