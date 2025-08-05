'use client';

import React, { useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@/components/Analytics';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  useEffect(() => {
    // Debug: Check if we're in the browser
    console.log('ClientProviders: Browser environment detected');
    console.log('Clerk publishable key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set');
  }, []);

  return (
    <ClerkProvider
      clerkJSVersion="latest"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="jovie-theme"
      >
        {children}
        <Analytics />
      </ThemeProvider>
    </ClerkProvider>
  );
}
