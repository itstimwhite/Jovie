'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function RedirectTracker() {
  useEffect(() => {
    // Parse cookies safely
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
      return undefined;
    };
    
    // Get redirect type from cookie
    const redirectType = getCookie('x-route-redirect');

    if (redirectType) {
      // Track the redirect event
      if (redirectType === 'dashboard-to-overview') {
        track('route_redirect', {
          from: '/dashboard',
          to: '/dashboard/overview',
          type: 'legacy_redirect',
        });
      }

      // Clear the cookie after tracking (set expiration in the past)
      document.cookie = 'x-route-redirect=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, []);

  // This component doesn't render anything
  return null;
}
