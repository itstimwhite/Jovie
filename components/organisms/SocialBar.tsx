import { SocialLink } from '@/components/molecules/SocialLink';
import { TipButton } from '@/components/ui/TipButton';
import type { SocialLink as SocialLinkType } from '@/types/db';

interface SocialBarProps {
  handle: string;
  artistName: string;
  socialLinks: SocialLinkType[];
  showTipButton?: boolean;
}

export function SocialBar({
  handle,
  artistName,
  socialLinks,
  showTipButton = false,
}: SocialBarProps) {
  // If no social links and no tip button, hide the component
  if (socialLinks.length === 0 && !showTipButton) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-sm mx-auto">
      {/* Social Icons - Left Side */}
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <SocialLink
            key={link.id}
            link={link}
            handle={handle}
            artistName={artistName}
          />
        ))}
      </div>

      {/* Tip Button - Right Side */}
      {showTipButton && (
        <div className="flex-shrink-0">
          <TipButton handle={handle} artistName={artistName} />
        </div>
      )}
    </div>
  );
}
