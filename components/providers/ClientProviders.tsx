'use client';

import React, { useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@/components/Analytics';
import { DebugBanner } from '@/components/DebugBanner';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  useEffect(() => {
    // Debug: Check if we're in the browser
    console.log('ClientProviders: Browser environment detected');
    console.log(
      'Clerk publishable key:',
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'
    );
  }, []);

  // Check if Clerk publishable key is available
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error('Clerk publishable key is not set');
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
    <ClerkProvider clerkJSVersion="latest" publishableKey={publishableKey}>
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
    </ClerkProvider>
  );
}
