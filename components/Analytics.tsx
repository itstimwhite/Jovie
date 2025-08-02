'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { analytics } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      analytics.page();
    }
  }, [pathname]);

  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);

  return null;
}