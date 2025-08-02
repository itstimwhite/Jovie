'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      analytics.page();
    }
  }, [pathname]);

  return null;
}
