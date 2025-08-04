'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
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

      const { data, error } = await supabase.functions.invoke('import-artist', {
        body: {
          spotifyId: pendingClaim.spotifyId,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        },
      });

      sessionStorage.removeItem('pendingClaim');

      if (error || data?.error) {
        console.error('Error processing pending claim:', error || data?.error);
        setError(
          (data?.error as string) || "We couldn't claim your artist profile."
        );
      } else {
        track('artist_claim_success', {
          handle: data.handle,
          spotifyId: pendingClaim.spotifyId,
        });
        router.push('/dashboard');
      }

      setIsProcessing(false);
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
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Claim Failed
          </h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              router.push('/');
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-sm hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
