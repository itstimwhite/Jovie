'use client';

import React, { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@/components/Analytics';
import { DebugBanner } from '@/components/DebugBanner';
import { FeatureFlagsProvider } from './FeatureFlagsProvider';
import { FeatureFlags } from '@/lib/feature-flags';

interface ClientProvidersProps {
  children: React.ReactNode;
  initialFeatureFlags?: FeatureFlags;
}

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
    // Debug: Check if we're in the browser
    console.log('ClientProviders: Browser environment detected');
    console.log(
      'Clerk publishable key:',
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'
    );
    setIsClient(true);

    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state during hydration
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
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
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="jovie-theme"
        >
          <DebugBanner />
          {children}
          <Analytics />
        </ThemeProvider>
      </FeatureFlagsProvider>
    </ClerkWrapper>
  );
}
