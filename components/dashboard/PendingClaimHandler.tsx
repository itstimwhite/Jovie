'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function PendingClaimHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check for pending claims and redirect if needed
    const pendingClaim = sessionStorage.getItem('pendingClaim');
    const selectedArtist = sessionStorage.getItem('selectedArtist');

    if (pendingClaim && !selectedArtist) {
      // User has a pending claim but hasn't selected an artist yet
      router.push('/artist-selection');
    }
  }, [router]);

  return null; // This component renders nothing
}
