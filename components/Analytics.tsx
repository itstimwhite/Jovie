'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { page } from '@/lib/analytics';
import { useConsent } from '@/lib/cookies/useConsent';

export function Analytics() {
  const pathname = usePathname();
  const consent = useConsent();

  useEffect(() => {
    try {
      // Only run on client side and when analytics consent is given
      if (typeof window === 'undefined' || !consent?.analytics) return;

      // Skip tracking on sensitive routes
      if (
        pathname.startsWith('/go/') ||
        pathname.startsWith('/out/') ||
        pathname.startsWith('/api/') ||
        pathname.includes('/404') ||
        pathname.includes('/500')
      ) {
        return;
      }

      // Track page views with our analytics
      page(pathname, {
        url: pathname,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [pathname, consent]);

  return null;
}
