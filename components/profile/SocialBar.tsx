'use client';

import { SocialLink } from '@/types/db';
import { track } from '@/lib/analytics';
import {
  siInstagram,
  siX,
  siTiktok,
  siYoutube,
  siFacebook,
  siSpotify,
  siApplemusic,
  siSoundcloud,
  siBandcamp,
  siDiscord,
  siReddit,
  siPinterest,
  siTumblr,
  siVimeo,
  siGithub,
  type SimpleIcon,
  siMedium,
  siPatreon,
} from 'simple-icons';

interface SocialBarProps {
  handle: string;
  artistName: string;
  socialLinks: SocialLink[];
}

export function SocialBar({ handle, artistName, socialLinks }: SocialBarProps) {
  const handleSocialClick = async (link: SocialLink) => {
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

    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Always render the container to prevent layout shift, but hide if no links
  return (
    <div
      className={`flex flex-wrap justify-center gap-3 ${socialLinks.length === 0 ? 'hidden' : ''}`}
    >
      {socialLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => handleSocialClick(link)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
          title={`Follow on ${link.platform}`}
          aria-label={`Follow ${artistName} on ${link.platform}`}
        >
          <SocialIcon platform={link.platform} />
        </button>
      ))}
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = 'h-3.5 w-3.5';

  // Map platform names to Simple Icons
  const getIcon = (platform: string) => {
    const platformMap: Record<string, SimpleIcon> = {
      instagram: siInstagram,
      twitter: siX,
      tiktok: siTiktok,
      youtube: siYoutube,
      facebook: siFacebook,
      spotify: siSpotify,
      apple: siApplemusic,
      soundcloud: siSoundcloud,
      bandcamp: siBandcamp,
      discord: siDiscord,
      reddit: siReddit,
      pinterest: siPinterest,
      tumblr: siTumblr,
      vimeo: siVimeo,
      github: siGithub,
      medium: siMedium,
      patreon: siPatreon,
    };

    return platformMap[platform.toLowerCase()];
  };

  const icon = getIcon(platform);

  if (icon) {
    return (
      <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
        <path d={icon.path} />
      </svg>
    );
  }

  // Fallback for unknown platforms
  return (
    <svg
      className={iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}
