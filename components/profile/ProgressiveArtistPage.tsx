'use client';

import { useState, useEffect } from 'react';
import { StaticArtistPage } from '@/components/profile/StaticArtistPage';
import { Artist, LegacySocialLink } from '@/types/db';
import dynamic from 'next/dynamic';

// Lazy load the animated version
const AnimatedArtistPage = dynamic(
  () =>
    import('@/components/profile/AnimatedArtistPage').then((mod) => ({
      default: mod.AnimatedArtistPage,
    })),
  {
    ssr: false,
    loading: () => null, // Don't show loading, use static version
  }
);

interface ProgressiveArtistPageProps {
  mode: string;
  artist: Artist;
  socialLinks: LegacySocialLink[];
  subtitle: string;
  showTipButton: boolean;
  showBackButton: boolean;
}

export function ProgressiveArtistPage(props: ProgressiveArtistPageProps) {
  const [shouldUseAnimated, setShouldUseAnimated] = useState(false);

  useEffect(() => {
    // Only load animations after hydration and a small delay for better UX
    const timer = setTimeout(() => {
      setShouldUseAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Start with static version for immediate rendering
  if (!shouldUseAnimated) {
    return <StaticArtistPage {...props} />;
  }

  // Upgrade to animated version after hydration
  return <AnimatedArtistPage {...props} />;
}
