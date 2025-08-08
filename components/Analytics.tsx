'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { page } from '@/lib/analytics';

// Type for Vercel Analytics
declare global {
  interface Window {
    va?: (event: string, data: Record<string, unknown>) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();

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

  return null;
}
