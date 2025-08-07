'use client';

import React from 'react';
import { LogLevel, StatsigProvider } from '@statsig/react-bindings';
import { useUser } from '@clerk/nextjs';

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // Create user object for Statsig
  const statsigUser = {
    userID: user?.id || 'anonymous-user',
    email: user?.emailAddresses?.[0]?.emailAddress,
    custom: {
      plan: (user?.publicMetadata?.plan as string) || 'free',
    },
  };

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // If not in browser, render children without Statsig
  if (!isBrowser) {
    return <>{children}</>;
  }

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      user={statsigUser}
      options={{
        logLevel:
          process.env.NODE_ENV === 'development'
            ? LogLevel.Debug
            : LogLevel.Warn,
        environment: { tier: process.env.NODE_ENV || 'development' },
      }}
    >
      {children}
    </StatsigProvider>
  );
}
