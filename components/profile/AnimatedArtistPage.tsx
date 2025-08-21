'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtistPageShell } from '@/components/profile/ArtistPageShell';
import { ListenNow } from '@/components/profile/ListenNow';
import { AnimatedListenInterface } from '@/components/profile/AnimatedListenInterface';
import VenmoTipSelector from '@/components/profile/VenmoTipSelector';
import { ProfileSection } from '@/components/organisms/ProfileSection';
import { FrostedButton } from '@/components/atoms/FrostedButton';
import { Artist, LegacySocialLink } from '@/types/db';
import Link from 'next/link';

interface AnimatedArtistPageProps {
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
          <AnimatedListenInterface artist={artist} handle={artist.handle} />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProfileSection artist={artist} subtitle={subtitle}>
            <VenmoTipSelector
              venmoLink={venmoLink || ''}
              venmoUsername={venmoUsername ?? undefined}
              amounts={AMOUNTS}
              className="w-full max-w-sm"
            />
          </ProfileSection>
        </motion.div>
      );

    default: // 'profile' mode
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
      );
  }
}

export function AnimatedArtistPage({
  mode,
  artist,
  socialLinks,
  subtitle,
  showTipButton,
  showBackButton,
}: AnimatedArtistPageProps) {
  // Page-level animation variants with Apple-style easing
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 10,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Apple's signature easing curve
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      y: -10,
      filter: 'blur(2px)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        <ArtistPageShell
          artist={artist}
          socialLinks={socialLinks}
          subtitle={subtitle}
          showTipButton={showTipButton}
          showBackButton={showBackButton}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
          >
            {renderContent(mode, artist, socialLinks, subtitle, showTipButton)}
          </motion.div>
        </ArtistPageShell>
      </motion.div>
    </AnimatePresence>
  );
}
