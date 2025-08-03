'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import { APP_URL } from '@/constants/app';

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
      track('listen_click', {
        handle,
        artist: artistName,
        platform: 'spotify',
      });

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

      window.open(
        `${APP_URL}/${handle}/listen`,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (error) {
      console.error('Failed to track listen click:', error);
      // Still open the link even if tracking fails
      window.open(
        `${APP_URL}/${handle}/listen`,
        '_blank',
        'noopener,noreferrer'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Button
        onClick={handleClick}
        className="w-full"
        size="lg"
        disabled={isLoading}
        aria-label={`Listen to ${artistName} on Spotify`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Opening...</span>
          </div>
        ) : (
          'Listen Now'
        )}
      </Button>
    </div>
  );
}
