'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Skeleton component for loading state
function TipJarSkeleton() {
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
      </div>
      
      {/* Amount buttons skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse flex-1"
          />
        ))}
      </div>
      
      {/* Payment button skeleton */}
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
    </div>
  );
}

interface TipJarProps {
  handle: string;
  artistName: string;
}

// Dynamic import with loading state
const TipJar = dynamic(
  () => import('./TipJar'),
  {
    loading: () => <TipJarSkeleton />,
    ssr: false, // Stripe doesn't work well with SSR
  }
) as ComponentType<TipJarProps>;

export { TipJar as TipJarDynamic };
export type { TipJarProps };