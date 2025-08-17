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
      className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-200 ease-out transform-gpu hover:scale-105 hover:bg-gray-200 hover:shadow-md active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:scale-105 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 cursor-pointer"
      title={`Follow on ${link.platform}`}
      aria-label={`Follow ${artistName} on ${link.platform}`}
    >
      <SocialIcon
        platform={link.platform}
        className="h-4 w-4 transition-transform duration-200 ease-out group-hover:scale-110"
      />
    </a>
  );
}
