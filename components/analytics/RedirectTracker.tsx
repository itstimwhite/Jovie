'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function RedirectTracker() {
  useEffect(() => {
    // Check for redirect header
    const redirectType = document.cookie
      .split('; ')
      .find(row => row.startsWith('x-route-redirect='))
      ?.split('=')[1];

    if (redirectType) {
      // Track the redirect event
      if (redirectType === 'dashboard-to-overview') {
        track('route_redirect', {
          from: '/dashboard',
          to: '/dashboard/overview',
          type: 'legacy_redirect',
        });
      }

      // Clear the cookie after tracking
      document.cookie = 'x-route-redirect=; max-age=0; path=/;';
    }
  }, []);

  // This component doesn't render anything
  return null;
}

