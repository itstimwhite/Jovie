'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface TipJarProps {
  handle: string;
  artistName: string;
}

// Loading skeleton for TipJar
const TipJarSkeleton = () => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-2 animate-pulse" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-48 mx-auto animate-pulse" />
    </div>
    
    {/* Amount buttons skeleton */}
    <div className="flex justify-center gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        />
      ))}
    </div>
    
    {/* Payment method skeleton */}
    <div className="space-y-2">
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    </div>
  </div>
);

// Dynamically import TipJar with Stripe dependencies
const DynamicTipJar = dynamic(
  () => import('./TipJar').then((mod) => ({ default: mod.TipJar })),
  {
    loading: () => <TipJarSkeleton />,
    ssr: false, // Stripe doesn't work with SSR
  }
);

export const TipJarDynamic: React.FC<TipJarProps> = (props) => {
  return <DynamicTipJar {...props} />;
};

export type { TipJarProps };