'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/Combobox';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';
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

  // Convert Spotify artists to Combobox options
  const options = results.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url,
  }));

  const handleSubmit = () => {
    if (selectedArtist) {
      handleArtistSelect({
        id: selectedArtist.id,
        name: selectedArtist.name,
        imageUrl: selectedArtist.images?.[0]?.url,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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
        onSubmit={handleSubmit}
        placeholder="Search for your artist on Spotify..."
        label="Search for your artist on Spotify"
        isLoading={isLoading}
        error={error}
        ctaText="Claim Profile"
        showCta={true}
        className="w-full"
      />
    </div>
  );
}
