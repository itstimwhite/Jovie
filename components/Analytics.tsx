'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { page, track } from '@/lib/analytics';

// Type for Vercel Analytics
declare global {
  interface Window {
    va?: (event: string, data: Record<string, unknown>) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return;

      // Track page views with Vercel Analytics
      if (window.va) {
        window.va('page_view', {
          url: pathname,
        });
      }

      // Track page views with our analytics
      page(pathname, {
        url: pathname,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (trackedRef.current) return;
      if (searchParams.get('src') === 'qr_desktop') {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          track('desktop_qr_scan_redirected', {
            profile: segments[0],
            route: pathname,
          });
          trackedRef.current = true;
        }
      }
    } catch (error) {
      console.error('Analytics redirect error:', error);
    }
  }, [pathname, searchParams]);

  return null;
}
