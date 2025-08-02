'use client';

import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import { APP_URL } from '@/constants/app';

interface ListenNowProps {
  handle: string;
  artistName: string;
}

export function ListenNow({ handle, artistName }: ListenNowProps) {
  const handleClick = async () => {
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

    window.open(`${APP_URL}/${handle}/listen`, '_blank');
  };

  return (
    <div className="w-full max-w-sm">
      <Button
        onClick={handleClick}
        className="w-full"
        size="lg"
      >
        Listen Now
      </Button>
    </div>
  );
}