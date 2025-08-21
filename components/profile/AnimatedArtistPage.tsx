'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtistPageShell } from '@/components/profile/ArtistPageShell';
import { AnimatedListenInterface } from '@/components/profile/AnimatedListenInterface';
import VenmoTipSelector from '@/components/profile/VenmoTipSelector';
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
  socialLinks: LegacySocialLink[]
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
          <div className="space-y-4">
            {venmoLink ? (
              <VenmoTipSelector
                venmoLink={venmoLink}
                venmoUsername={venmoUsername ?? undefined}
                amounts={AMOUNTS}
                className="w-full max-w-sm"
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
          </div>
        </motion.div>
      );

    default: // 'profile' mode
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <Link
              href={`/${artist.handle}?mode=listen`}
              prefetch
              className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2"
            >
              🎵 Listen Now
            </Link>
          </div>
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
            {renderContent(mode, artist, socialLinks)}
          </motion.div>
        </ArtistPageShell>
      </motion.div>
    </AnimatePresence>
  );
}
