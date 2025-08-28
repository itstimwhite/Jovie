import { Footer } from '@/components/organisms/Footer';

interface ProfileFooterProps {
  artistHandle: string;
  hideBranding?: boolean;
  artistSettings?: {
    hide_branding?: boolean;
  };
}

export function ProfileFooter({
  artistHandle,
  hideBranding = false,
  artistSettings,
}: ProfileFooterProps) {
  return (
    <Footer
      variant='profile'
      artistHandle={artistHandle}
      hideBranding={hideBranding}
      artistSettings={artistSettings}
    />
  );
}
