'use client';

import { useInitializeAnalytics } from '@/lib/analytics';

/**
 * Provider component that initializes analytics when consent is available
 * This component should be included in the app layout
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Initialize analytics when consent is available
  useInitializeAnalytics();

  // This is a non-rendering component, just pass children through
  return <>{children}</>;
}
