'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@/components/Analytics';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#111827',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#111827',
        },
        elements: {
          formButtonPrimary: 'bg-gray-900 hover:bg-gray-800 text-white',
          card: 'border border-gray-200 shadow-sm',
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Analytics />
      </ThemeProvider>
    </ClerkProvider>
  );
}
