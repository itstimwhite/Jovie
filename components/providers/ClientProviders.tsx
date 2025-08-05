'use client';

import React from 'react';
import { Analytics } from '@/components/Analytics';
import { ThemeProvider } from '@/context/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jovie-theme">
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
