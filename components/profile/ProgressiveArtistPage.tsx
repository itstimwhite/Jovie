'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // Prefetch all artist modes for snappy transitions
  useEffect(() => {
    const base = `/${props.artist.handle}`;
    ['profile', 'listen', 'tip']
      .filter((m) => m !== props.mode)
      .forEach((mode) => {
        const searchUrl = mode === 'profile' ? base : `${base}?mode=${mode}`;
        router.prefetch(searchUrl);
        router.prefetch(`${base}/${mode}`);
      });
  }, [router, props.artist.handle, props.mode]);

  useEffect(() => {
    // For listen mode, stay with static version for better performance
    if (props.mode === 'listen') {
      return; // Don't upgrade to animated for listen mode
    }

    // Only load animations after hydration with no delay for other modes
    setShouldUseAnimated(true);
  }, [props.mode]);

  // Start with static version for immediate rendering
  if (!shouldUseAnimated) {
    return <StaticArtistPage {...props} />;
  }

  // Upgrade to animated version after hydration
  return <AnimatedArtistPage {...props} />;
}
