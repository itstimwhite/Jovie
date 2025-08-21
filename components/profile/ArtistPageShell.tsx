import React from 'react';
import { ProfileShell } from '@/components/organisms/ProfileShell';
import { Artist, LegacySocialLink } from '@/types/db';

type ArtistPageShellProps = {
  artist: Artist;
  socialLinks: LegacySocialLink[];
  subtitle?: string;
  children?: React.ReactNode;
  showSocialBar?: boolean;
  showTipButton?: boolean;
  showBackButton?: boolean;
  showFooter?: boolean;
  maxWidthClass?: string;
};

export function ArtistPageShell({
  artist,
  socialLinks,
  subtitle,
  children,
  showSocialBar = true,
  showTipButton = false,
  showBackButton = false,
  showFooter = true,
  maxWidthClass = 'w-full max-w-md',
}: ArtistPageShellProps) {
  return (
    <ProfileShell
      artist={artist}
      socialLinks={socialLinks}
      subtitle={subtitle}
      showSocialBar={showSocialBar}
      showTipButton={showTipButton}
      showBackButton={showBackButton}
      showFooter={showFooter}
      showNotificationButton={process.env.NODE_ENV === 'development'}
      maxWidthClass={maxWidthClass}
      backgroundPattern="grid"
      showGradientBlurs={true}
    >
      {children}
    </ProfileShell>
  );
}
