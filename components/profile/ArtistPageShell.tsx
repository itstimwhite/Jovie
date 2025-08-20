import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SocialLink as SocialLinkComponent } from '@/components/molecules/SocialLink';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Gradient Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 dark:from-purple-400/20 dark:to-cyan-400/20 rounded-full blur-3xl opacity-50" />

      <Container>
        {/* Back Button - Top left */}
        {showBackButton && (
          <div className="absolute top-4 left-4 z-10">
            <Link
              href={`/${artist.handle}`}
              className="w-10 h-10 bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/30 dark:border-white/10 rounded-full flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Back to profile"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
          </div>
        )}

        {/* Top right controls */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            {/* Notification Bell (feature flagged) */}
            <button
              className="w-10 h-10 bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/30 dark:border-white/10 rounded-full flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="flex min-h-screen flex-col py-12 relative z-10">
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className={`${maxWidthClass} space-y-8`}>
              <ProfileHeader artist={artist} subtitle={subtitle} />
              {children}
              {(showSocialBar || showTipButton) && (
                <div className="flex justify-between items-center">
                  {/* Social Icons - Left side */}
                  <div className="flex-1 flex justify-start">
                    {showSocialBar && socialLinks.length > 0 && (
                      <div className="flex gap-3">
                        {socialLinks.map((link) => (
                          <SocialLinkComponent
                            key={link.id}
                            link={link}
                            handle={artist.handle}
                            artistName={artist.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tip Button - Right side */}
                  {showTipButton && (
                    <div className="flex-shrink-0">
                      <Link
                        href={`/${artist.handle}?mode=tip`}
                        className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium text-xs rounded-full transition-all duration-200 border border-gray-200/30 dark:border-white/10 backdrop-blur-sm cursor-pointer"
                      >
                        <span className="mr-1.5 text-xs">💸</span>
                        Tip
                      </Link>
                    </div>
                  )}
                </div>
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
