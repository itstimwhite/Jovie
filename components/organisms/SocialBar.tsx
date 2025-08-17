import { SocialLink } from '@/components/molecules/SocialLink';
import type { SocialLink as SocialLinkType } from '@/types/db';

interface SocialBarProps {
  handle: string;
  artistName: string;
  socialLinks: SocialLinkType[];
}

export function SocialBar({ handle, artistName, socialLinks }: SocialBarProps) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-4 py-2 ${socialLinks.length === 0 ? 'hidden' : ''}`}
      role="list"
      aria-label={`Social media links for ${artistName}`}
    >
      {socialLinks.map((link) => (
        <div key={link.id} role="listitem">
          <SocialLink link={link} handle={handle} artistName={artistName} />
        </div>
      ))}
    </div>
  );
}
