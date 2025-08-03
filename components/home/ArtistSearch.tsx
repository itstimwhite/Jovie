'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/Combobox';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';
import { Button } from '@/components/ui/Button';
import { SpotifyArtist } from '@/types/common';
import { FEATURE_FLAGS } from '@/constants/app';

export function ArtistSearch() {
  const router = useRouter();
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const { results, isLoading, error, updateQuery } = useArtistSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 8,
  });

  const handleArtistSelect = (
    option: { id: string; name: string; imageUrl?: string } | null
  ) => {
    if (option) {
      // Find the full artist data from results
      const artist = results.find((a) => a.id === option.id);
      if (artist) {
        setSelectedArtist(artist);
        // Store the selected artist in sessionStorage for the claim process
        sessionStorage.setItem(
          'pendingClaim',
          JSON.stringify({
            spotifyId: artist.id,
            artistName: artist.name,
            timestamp: Date.now(),
          })
        );

        // Redirect to claim page or waitlist based on feature flag
        router.push(FEATURE_FLAGS.waitlistEnabled ? '/waitlist' : '/sign-up');
      }
    } else {
      setSelectedArtist(null);
    }
  };

  const handleInputChange = (value: string) => {
    updateQuery(value);
  };

  const handleClaimClick = () => {
    if (selectedArtist) {
      handleArtistSelect({
        id: selectedArtist.id,
        name: selectedArtist.name,
        imageUrl: selectedArtist.images?.[0]?.url,
      });
    }
  };

  // Convert Spotify artists to Combobox options
  const options = results.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Search Field with Inline Claim Button */}
      <div className="relative">
        <div className="flex items-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-xs ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-purple-400/50 transition-all duration-200">
          <div className="flex-1">
            <Combobox
              options={options}
              value={
                selectedArtist
                  ? {
                      id: selectedArtist.id,
                      name: selectedArtist.name,
                      imageUrl: selectedArtist.images?.[0]?.url,
                    }
                  : null
              }
              onChange={handleArtistSelect}
              onInputChange={handleInputChange}
              placeholder="Search your Spotify artist name..."
              isLoading={isLoading}
              className="w-full border-0 bg-transparent text-white placeholder-white/60 focus:ring-0"
            />
          </div>

          {/* Inline Claim Button */}
          <div className="flex items-center pr-2">
            <Button
              onClick={handleClaimClick}
              disabled={!selectedArtist}
              variant="primary"
              size="sm"
              className="rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Claim Profile
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-2 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-white/60">
          Don&apos;t see your artist? Make sure you have a verified Spotify
          artist profile.
        </p>
      </div>
    </div>
  );
}
