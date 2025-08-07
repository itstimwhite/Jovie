'use client';

import React, { useEffect, useState } from 'react';
import { LogLevel, StatsigProvider } from '@statsig/react-bindings';
import { useUser } from '@clerk/nextjs';

interface StatsigProviderWrapperProps {
  children: React.ReactNode;
}

export function StatsigProviderWrapper({
  children,
}: StatsigProviderWrapperProps) {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render Statsig until we're on the client
  if (!isClient) {
    return <>{children}</>;
  }

  // Create user object for Statsig
  const statsigUser = {
    userID: user?.id || 'anonymous-user',
    email: user?.emailAddresses?.[0]?.emailAddress,
    custom: {
      plan: (user?.publicMetadata?.plan as string) || 'free',
    },
  };

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
