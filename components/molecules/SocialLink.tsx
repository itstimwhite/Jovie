'use client';

import { SocialIcon } from '@/components/atoms/SocialIcon';
import { track } from '@/lib/analytics';
import { getSocialDeepLinkConfig, openDeepLink } from '@/lib/deep-links';
import type { SocialLink as SocialLinkType } from '@/types/db';

interface SocialLinkProps {
  link: SocialLinkType;
  handle: string;
  artistName: string;
}

export function SocialLink({ link, handle, artistName }: SocialLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Track analytics first
    track('social_click', {
      handle,
      artist: artistName,
      platform: link.platform,
      url: link.url,
    });

    // Fire-and-forget server tracking
    fetch('/api/track', {
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
    }).catch(() => {
      // Ignore tracking errors
    });

    // Try deep linking
    const deepLinkConfig = getSocialDeepLinkConfig(link.platform);

    if (deepLinkConfig) {
      try {
        await openDeepLink(link.url, deepLinkConfig, {
          onNativeAttempt: () => {
            // Optional: could add loading state here
          },
          onFallback: () => {
            // Optional: could track fallback usage
          },
        });
      } catch (error) {
        console.debug('Deep link failed, using fallback:', error);
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    } else {
      // No deep link config, use original URL
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href={link.url}
      onClick={handleClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-200 ease-out hover:bg-gray-200 hover:scale-110 hover:shadow-sm active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 cursor-pointer"
      title={`Follow on ${link.platform}`}
      aria-label={`Follow ${artistName} on ${link.platform}. Opens in ${link.platform} app if installed, otherwise opens in web browser.`}
    >
      <SocialIcon platform={link.platform} />
    </a>
  );
}
