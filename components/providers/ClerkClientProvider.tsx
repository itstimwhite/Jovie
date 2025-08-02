'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkClientProviderProps {
  children: ReactNode;
  appearance?: any;
}

export function ClerkClientProvider({
  children,
  appearance,
}: ClerkClientProviderProps) {
  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>;
}
