'use client';

import { FEATURE_FLAGS } from '@/constants/app';
import { ArtistSearch } from './ArtistSearch';
import { WaitlistLink } from './WaitlistLink';

export function FeatureFlaggedArtistSearch() {
  // Show artist search if feature flag is enabled, otherwise show waitlist link
  if (FEATURE_FLAGS.artistSearchEnabled) {
    return <ArtistSearch />;
  }

  return <WaitlistLink />;
}
