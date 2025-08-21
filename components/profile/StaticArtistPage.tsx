import React from 'react';
import { ArtistPageShell } from '@/components/profile/ArtistPageShell';
import { StaticListenInterface } from '@/components/profile/StaticListenInterface';
import VenmoTipSelector from '@/components/profile/VenmoTipSelector';
import { ProfileSection } from '@/components/organisms/ProfileSection';
import { FrostedButton } from '@/components/atoms/FrostedButton';
import { Artist, LegacySocialLink } from '@/types/db';
import Link from 'next/link';

interface StaticArtistPageProps {
  mode: string;
  artist: Artist;
  socialLinks: LegacySocialLink[];
  subtitle: string;
  showTipButton: boolean;
  showBackButton: boolean;
}

function renderContent(
  mode: string,
  artist: Artist,
  socialLinks: LegacySocialLink[],
  subtitle: string,
  showTipButton: boolean
) {
  switch (mode) {
    case 'listen':
      return (
        <div className="flex justify-center">
          <StaticListenInterface artist={artist} handle={artist.handle} />
        </div>
      );

    case 'tip':
      // Extract Venmo link from social links
      const venmoLink =
        socialLinks.find((l) => l.platform === 'venmo')?.url || null;
      const extractVenmoUsername = (url: string | null): string | null => {
        if (!url) return null;
        try {
          const u = new URL(url);
          const allowedVenmoHosts = ['venmo.com', 'www.venmo.com'];
          if (allowedVenmoHosts.includes(u.hostname)) {
            const parts = u.pathname.split('/').filter(Boolean);
            if (parts[0] === 'u' && parts[1]) return parts[1];
            if (parts[0]) return parts[0];
          }
          return null;
        } catch {
          return null;
        }
      };

      const venmoUsername = extractVenmoUsername(venmoLink);
      const AMOUNTS = [3, 5, 7];

      return (
        <ProfileSection artist={artist} subtitle={subtitle}>
          {venmoLink ? (
            <VenmoTipSelector
              venmoLink={venmoLink}
              venmoUsername={venmoUsername ?? undefined}
              amounts={AMOUNTS}
            />
          ) : (
            <div className="text-center">
              <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5">
                <p className="text-gray-600 dark:text-gray-400">
                  Venmo tipping is not available for this artist yet.
                </p>
              </div>
            </div>
          )}
        </ProfileSection>
      );

    default: // 'profile' mode
      return (
        <ProfileSection artist={artist} subtitle={subtitle}>
          <div className="space-y-4">
            <Link href={`/${artist.handle}?mode=listen`}>
              <FrostedButton variant="default" size="lg" className="w-full">
                🎵 Listen Now
              </FrostedButton>
            </Link>
            {showTipButton && (
              <Link href={`/${artist.handle}?mode=tip`}>
                <FrostedButton variant="outline" size="lg" className="w-full">
                  💰 Send Tip
                </FrostedButton>
              </Link>
            )}
          </div>
        </ProfileSection>
      );
  }
}

// Static version without animations for immediate rendering
export function StaticArtistPage({
  mode,
  artist,
  socialLinks,
  subtitle,
  showTipButton,
  showBackButton,
}: StaticArtistPageProps) {
  return (
    <div className="w-full">
      <ArtistPageShell
        artist={artist}
        socialLinks={socialLinks}
        subtitle={subtitle}
        showTipButton={showTipButton}
        showBackButton={showBackButton}
      >
        <div>{renderContent(mode, artist, socialLinks, subtitle, showTipButton)}</div>
      </ArtistPageShell>
    </div>
  );
}
