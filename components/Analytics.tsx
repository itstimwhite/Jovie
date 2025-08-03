'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { page } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Track page views with Vercel Analytics
    if ((window as any).va) {
      (window as any).va('page_view', {
        url: pathname,
      });
    }

    // Track page views with our analytics
    page(pathname, {
      url: pathname,
    });
  }, [pathname]);

  return null;
}
