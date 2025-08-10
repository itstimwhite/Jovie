'use client';

import { SocialIcon } from '@/components/atoms/SocialIcon';
import { track } from '@/lib/analytics';
import type { SocialLink as SocialLinkType } from '@/types/db';

interface SocialLinkProps {
  link: SocialLinkType;
  handle: string;
  artistName: string;
}

export function SocialLink({ link, handle, artistName }: SocialLinkProps) {
  const handleClick = async () => {
    track('social_click', {
      handle,
      artist: artistName,
      platform: link.platform,
      url: link.url,
    });

    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle,
        linkType: 'social',
        target: link.platform,
        linkId: link.id,
      }),
    });
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
      title={`Follow on ${link.platform}`}
      aria-label={`Follow ${artistName} on ${link.platform}`}
    >
      <SocialIcon platform={link.platform} />
    </a>
  );
}
