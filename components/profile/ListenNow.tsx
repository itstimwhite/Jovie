'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
      <Button
        onClick={handleClick}
        className="w-full py-3 text-base sm:py-4 sm:text-lg"
        size="lg"
        disabled={isLoading}
        aria-label={`Listen to ${artistName} on Spotify`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Spinner size="sm" variant="dark" />
            <span>Opening...</span>
          </div>
        ) : (
          'Listen Now'
        )}
      </Button>
    </div>
  );
}
