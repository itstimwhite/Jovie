import { Footer } from '@/components/organisms/Footer';
import { VenmoTipButton } from '@/components/profile/VenmoTipButton';
import { LegacySocialLink } from '@/types/db';

interface ProfileFooterProps {
  artistHandle: string;
  hideBranding?: boolean;
  artistSettings?: {
    hide_branding?: boolean;
  };
  socialLinks?: LegacySocialLink[];
  artistName?: string;
}

export function ProfileFooter({
  artistHandle,
  hideBranding = false,
  artistSettings,
  socialLinks = [],
  artistName,
}: ProfileFooterProps) {
  return (
    <div className="flex flex-col items-center">
      <VenmoTipButton 
        socialLinks={socialLinks} 
        artistHandle={artistHandle}
        artistName={artistName}
      />
      <Footer
        variant='profile'
        artistHandle={artistHandle}
        hideBranding={hideBranding}
        artistSettings={artistSettings}
      />
    </div>
  );
}
