'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="jovie-theme"
    >
      {children}
    </ThemeProvider>
  );
}
