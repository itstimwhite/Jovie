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
  siMedium,
  siPatreon,
  siVenmo,
  siGooglechrome,
  type SimpleIcon,
} from 'simple-icons';

interface SocialIconProps {
  platform: string;
  className?: string;
}

// Map platform names to Simple Icons
const platformMap: Record<string, SimpleIcon> = {
  instagram: siInstagram,
  twitter: siX,
  x: siX,
  tiktok: siTiktok,
  youtube: siYoutube,
  facebook: siFacebook,
  spotify: siSpotify,
  apple: siApplemusic,
  applemusic: siApplemusic,
  apple_music: siApplemusic,
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
  venmo: siVenmo,
  website: siGooglechrome,
};

export function getPlatformIcon(platform: string): SimpleIcon | undefined {
  return platformMap[platform.toLowerCase()];
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  const icon = platformMap[platform.toLowerCase()];
  const iconClass = className || 'h-4 w-4';

  if (icon) {
    return (
      <svg
        className={iconClass}
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
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
      aria-hidden="true"
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
