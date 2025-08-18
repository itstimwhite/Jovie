'use client';

import React from 'react';

interface StatsigProviderWrapperProps {
  children: React.ReactNode;
}

// No-op wrapper retained for backward compatibility after removing Statsig.
// Simply renders children without any providers.
export function StatsigProviderWrapper({
  children,
}: StatsigProviderWrapperProps) {
  return <>{children}</>;
}
