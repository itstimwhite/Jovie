'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function PendingClaimRunner() {
  const router = useRouter();

  useEffect(() => {
    const runPendingClaim = async () => {
      const pendingClaim = sessionStorage.getItem('pendingClaim');
      if (!pendingClaim) return;

      try {
        const claim = JSON.parse(pendingClaim);
        const now = Date.now();
        const claimAge = now - claim.timestamp;

        // Only process claims that are less than 5 minutes old
        if (claimAge > 5 * 60 * 1000) {
          sessionStorage.removeItem('pendingClaim');
          return;
        }

        // Check if user already has an artist profile
        const { data: existingArtist } = await supabase
          .from('artists')
          .select('handle')
          .eq('spotify_id', claim.spotifyId)
          .single();

        if (existingArtist) {
          // User already has a profile, redirect to it
          sessionStorage.removeItem('pendingClaim');
          router.push(`/${existingArtist.handle}`);
          return;
        }

        // Check if the Spotify ID is already claimed by someone else
        const { data: claimedArtist } = await supabase
          .from('artists')
          .select('handle')
          .eq('spotify_id', claim.spotifyId)
          .single();

        if (claimedArtist) {
          // Already claimed by someone else
          sessionStorage.removeItem('pendingClaim');
          router.push(`/${claimedArtist.handle}`);
          return;
        }

        // If we get here, the claim is still valid and can be processed
        // The actual claim processing will happen in the onboarding form
      } catch (error) {
        console.error('Error processing pending claim:', error);
        sessionStorage.removeItem('pendingClaim');
      }
    };

    runPendingClaim();
  }, [router]);

  return null;
}
