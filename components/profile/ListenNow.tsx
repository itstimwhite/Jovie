'use client';

import { useState } from 'react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Spinner } from '@/components/ui';

interface ListenNowProps {
  handle: string;
  artistName: string;
}

export function ListenNow({ handle, artistName }: ListenNowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Simple tracking without analytics library
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle,
          linkType: 'listen',
          target: 'spotify',
        }),
      });

      window.open(`/${handle}/listen`, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track listen click:', error);
      // Still open the link even if tracking fails
      window.open(`/${handle}/listen`, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Frosted backdrop wrapper for premium look */}
      <div className="rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-md p-1 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <PrimaryCTA
          onClick={handleClick}
          ariaLabel={`Listen to ${artistName}`}
          autoFocus
          disabled={isLoading}
          className="relative"
        >
          {/* Cross-fade label/spinner without layout shift */}
          <div className="relative flex min-h-[1.5rem] items-center justify-center">
            <span
              className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            >
              Listen Now
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" variant="dark" />
                <span>Opening…</span>
              </span>
            </span>
          </div>
        </PrimaryCTA>
      </div>
    </div>
  );
}
