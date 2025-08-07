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
  const [isClient, setIsClient] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Wrap useUser in a try-catch to handle context not being available
  let user = null;
  let isLoaded = false;

  try {
    const userHook = useUser();
    user = userHook.user;
    isLoaded = userHook.isLoaded;
  } catch {
    // Clerk context not available yet
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsUserLoaded(true);
    }
  }, [isLoaded]);

  // Don't render Statsig until we're on the client and user is loaded
  if (!isClient || !isUserLoaded) {
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
