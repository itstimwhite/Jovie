'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { getSpotifyArtist, getArtistLatestRelease, buildSpotifyAlbumUrl } from '@/lib/spotify';
import { generateHandle } from '@/lib/utils';
import { track } from '@/lib/analytics';

interface PendingClaim {
  spotifyId: string;
  artistName: string;
  timestamp: number;
}

export function PendingClaimRunner() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    if (!isSignedIn || !user || isProcessing) return;

    const processPendingClaim = async () => {
      try {
        // Check for pending claim in sessionStorage
        const pendingClaimStr = sessionStorage.getItem('pendingClaim');
        if (!pendingClaimStr) return;

        const pendingClaim: PendingClaim = JSON.parse(pendingClaimStr);
        
        // Check if claim is still valid (within 1 hour)
        const now = Date.now();
        if (now - pendingClaim.timestamp > 60 * 60 * 1000) {
          sessionStorage.removeItem('pendingClaim');
          return;
        }

        setIsProcessing(true);

        // Get or create user in database
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        let userId;
        if (userError && userError.code === 'PGRST116') {
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert({
              clerk_id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
            })
            .select('id')
            .single();

          if (createUserError) throw createUserError;
          userId = newUser.id;
        } else if (userError) {
          throw userError;
        } else {
          userId = existingUser.id;
        }

        // Check if artist already exists for this user
        const { data: existingArtist } = await supabase
          .from('artists')
          .select('handle')
          .eq('owner_user_id', userId)
          .eq('spotify_id', pendingClaim.spotifyId)
          .single();

        if (existingArtist) {
          // Artist already claimed by this user, redirect to dashboard
          sessionStorage.removeItem('pendingClaim');
          router.push('/dashboard');
          return;
        }

        // Check if artist is claimed by another user
        const { data: claimedByOther } = await supabase
          .from('artists')
          .select('id')
          .eq('spotify_id', pendingClaim.spotifyId)
          .neq('owner_user_id', userId)
          .single();

        if (claimedByOther) {
          setError('This artist is already claimed by another user.');
          sessionStorage.removeItem('pendingClaim');
          return;
        }

        // Fetch artist data from Spotify
        const spotifyArtist = await getSpotifyArtist(pendingClaim.spotifyId);
        const suggestedHandle = generateHandle(spotifyArtist.name);

        // Insert artist
        const { data: artist, error: artistError } = await supabase
          .from('artists')
          .insert({
            owner_user_id: userId,
            handle: suggestedHandle,
            spotify_id: pendingClaim.spotifyId,
            name: spotifyArtist.name,
            image_url: spotifyArtist.images?.[0]?.url,
          })
          .select('*')
          .single();

        if (artistError) {
          if (artistError.code === '23505') {
            // Handle conflict, try with numeric suffix
            let counter = 1;
            let finalHandle = suggestedHandle;
            let inserted = false;
            let finalArtist = null;

            while (!inserted && counter < 10) {
              finalHandle = `${suggestedHandle}${counter}`;
              const { data: retryArtist, error: retryError } = await supabase
                .from('artists')
                .insert({
                  owner_user_id: userId,
                  handle: finalHandle,
                  spotify_id: pendingClaim.spotifyId,
                  name: spotifyArtist.name,
                  image_url: spotifyArtist.images?.[0]?.url,
                })
                .select('*')
                .single();

              if (!retryError) {
                inserted = true;
                finalArtist = retryArtist;
              } else if (retryError.code !== '23505') {
                throw retryError;
              }
              counter++;
            }

            if (!inserted || !finalArtist) {
              throw new Error('Could not generate unique handle');
            }

            // Use the final artist for the rest of the process
            const artist = finalArtist;
          } else {
            throw artistError;
          }
        }

        if (!artist) {
          throw new Error('Failed to create artist profile');
        }

        // Try to fetch and insert latest release
        try {
          const latestRelease = await getArtistLatestRelease(pendingClaim.spotifyId);
          if (latestRelease) {
            await supabase.from('releases').insert({
              artist_id: artist.id,
              dsp: 'spotify',
              title: latestRelease.name,
              url: buildSpotifyAlbumUrl(latestRelease.id),
              release_date: latestRelease.release_date,
            });
          }
        } catch (releaseError) {
          console.warn('Failed to fetch latest release:', releaseError);
        }

        // Track successful claim
        track('artist_claim_success', {
          handle: artist.handle,
          spotifyId: pendingClaim.spotifyId,
        });

        // Clear pending claim and redirect
        sessionStorage.removeItem('pendingClaim');
        router.push('/dashboard');

      } catch (err) {
        console.error('Error processing pending claim:', err);
        setError(err instanceof Error ? err.message : 'Failed to claim artist');
        sessionStorage.removeItem('pendingClaim');
      } finally {
        setIsProcessing(false);
      }
    };

    processPendingClaim();
  }, [isSignedIn, user, isProcessing, router, supabase]);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <p className="text-gray-700">Claiming your artist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Claim Failed</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              router.push('/');
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
} 