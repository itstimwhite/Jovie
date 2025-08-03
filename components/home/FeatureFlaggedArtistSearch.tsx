'use client';

import { FEATURE_FLAGS } from '@/constants/app';
import { ArtistSearch } from './ArtistSearch';
import { WaitlistLink } from './WaitlistLink';

export function FeatureFlaggedArtistSearch() {
  // Show waitlist link if waitlist is enabled, otherwise show artist search
  if (FEATURE_FLAGS.waitlistEnabled) {
    return <WaitlistLink />;
  }

  return <ArtistSearch />;
}
