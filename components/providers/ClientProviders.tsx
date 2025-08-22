'use client';

import React, { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@/components/Analytics';
import { FeatureFlagsProvider } from './FeatureFlagsProvider';
import { FeatureFlags } from '@/lib/feature-flags';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';
// import { Toolbar } from '@vercel/toolbar/next';

interface ClientProvidersProps {
  children: React.ReactNode;
  initialFeatureFlags?: FeatureFlags;
}

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600">
            Clerk publishable key is not configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      clerkJSVersion="latest"
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function ClientProviders({
  children,
  initialFeatureFlags,
}: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Environment-gated startup log
    try {
      logger.group('Jovie App');
      logger.info('Booting client providers', {
        vercelEnv: process.env.VERCEL_ENV || 'local',
        nodeEnv: process.env.NODE_ENV,
      });
      if (initialFeatureFlags) {
        logger.debug('Initial feature flags', initialFeatureFlags);
      }
      logger.groupEnd();

      // Initialize Web Vitals tracking - temporarily disabled due to import issues
      // import('@/lib/monitoring/web-vitals').then(({ initWebVitals }) => {
      //   initWebVitals((metric) => {
      //     // Create a custom event for the performance dashboard
      //     if (typeof window !== 'undefined') {
      //       const event = new CustomEvent('web-vitals', { detail: metric });
      //       window.dispatchEvent(event);
      //     }
      //   });
      // });

      // Initialize other performance monitoring - temporarily disabled
      // import('@/lib/monitoring').then(({ initAllMonitoring }) => {
      //   initAllMonitoring();
      // });
    } catch (error) {
      console.error('Error initializing monitoring:', error);
    }

    return () => clearTimeout(timer);
  }, [initialFeatureFlags]);

  // Show loading state during hydration
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" showDebounce />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkWrapper>
      <FeatureFlagsProvider initialFlags={initialFeatureFlags}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="jovie-theme"
        >
          {children}
          <Analytics />
          {/* <Toolbar /> */}
        </ThemeProvider>
      </FeatureFlagsProvider>
    </ClerkWrapper>
  );
}
