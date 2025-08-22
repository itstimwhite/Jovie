'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { page, initPostHog } from '@/lib/analytics';
import { useConsent } from '@/lib/cookies/useConsent';

export function Analytics() {
  const pathname = usePathname();
  const { hasAnalyticsConsent, loading } = useConsent();

  // Initialize PostHog when consent is given
  useEffect(() => {
    if (hasAnalyticsConsent && !loading) {
      initPostHog();
    }
  }, [hasAnalyticsConsent, loading]);

  // Track page views only when consent is given
  useEffect(() => {
    try {
      // Only run on client side with consent
      if (typeof window === 'undefined' || !hasAnalyticsConsent || loading)
        return;

      // Track page views with our analytics
      page(pathname, {
        url: pathname,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [pathname, hasAnalyticsConsent, loading]);

  return null;
}
