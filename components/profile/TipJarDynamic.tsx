'use client';

import { lazy, Suspense } from 'react';
import { trackDynamicImportSuccess, trackDynamicImportFailure } from '@/lib/analytics';

// Dynamically import TipJar to defer Stripe loading until needed
const TipJar = lazy(() => {
  const startTime = performance.now();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  return import('./TipJar')
    .then((module) => {
      const loadTime = performance.now() - startTime;
      trackDynamicImportSuccess('TipJar', loadTime, pathname);
      return module;
    })
    .catch((error) => {
      trackDynamicImportFailure('TipJar', error.message, pathname);
      throw error;
    });
});

interface TipJarDynamicProps {
  handle: string;
  artistName: string;
}

function TipJarSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function TipJarDynamic({ handle, artistName }: TipJarDynamicProps) {
  return (
    <Suspense fallback={<TipJarSkeleton />}>
      <TipJar handle={handle} artistName={artistName} />
    </Suspense>
  );
}

export default TipJarDynamic;