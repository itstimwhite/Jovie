'use client';

import { ArtistSearch } from './ArtistSearch';
import { WaitlistLink } from './WaitlistLink';
import { useFeatureFlags } from '@/components/providers/FeatureFlagsProvider';

export function FeatureFlaggedArtistSearch() {
  const { flags } = useFeatureFlags();

  // Show waitlist link if waitlist is enabled, otherwise show artist search
  if (flags.waitlistEnabled) {
    return <WaitlistLink />;
  }

  return <ArtistSearch />;
}
