import React from 'react';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SocialBar } from '@/components/organisms/SocialBar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { Artist, SocialLink } from '@/types/db';

type ArtistPageShellProps = {
  artist: Artist;
  socialLinks: SocialLink[];
  subtitle?: string;
  children?: React.ReactNode;
  showSocialBar?: boolean;
  showTipButton?: boolean;
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
  showFooter = true,
  maxWidthClass = 'w-full max-w-md',
}: ArtistPageShellProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Container>
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="flex min-h-screen flex-col py-12">
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className={`${maxWidthClass} space-y-8`}>
              <ProfileHeader artist={artist} subtitle={subtitle} />
              {children}
              {showSocialBar && (
                <SocialBar
                  handle={artist.handle}
                  artistName={artist.name}
                  socialLinks={socialLinks}
                  showTipButton={showTipButton}
                />
              )}
            </div>
          </div>

          {showFooter && (
            <div className="flex justify-center">
              <div className={`${maxWidthClass}`}>
                <ProfileFooter
                  artistHandle={artist.handle}
                  artistSettings={artist.settings}
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
