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
      <PrimaryCTA
        onClick={handleClick}
        ariaLabel={`Listen to ${artistName}`}
        autoFocus
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" variant="dark" />
            <span>Opening...</span>
          </span>
        ) : (
          'Listen Now'
        )}
      </PrimaryCTA>
    </div>
  );
}
