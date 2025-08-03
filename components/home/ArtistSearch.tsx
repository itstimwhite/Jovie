'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/Combobox';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';
import { Button } from '@/components/ui/Button';

interface SpotifyArtist {
  id: string;
  name: string;
  images?: Array<{ url: string; width: number; height: number }>;
  popularity: number;
}

export function ArtistSearch() {
  const router = useRouter();
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
  const { results, isLoading, error, updateQuery } = useArtistSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 8,
  });

  const handleArtistSelect = (option: { id: string; name: string; imageUrl?: string } | null) => {
    if (option) {
      // Find the full artist data from results
      const artist = results.find(a => a.id === option.id);
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
        
        // Redirect to claim page
        router.push('/sign-up');
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Find your artist profile
        </h2>
        <p className="text-lg text-white/80">
          Search for your Spotify artist profile and claim your Jovie link
        </p>
      </div>

      <div className="space-y-4">
        <Combobox
          options={options}
          value={selectedArtist ? {
            id: selectedArtist.id,
            name: selectedArtist.name,
            imageUrl: selectedArtist.images?.[0]?.url,
          } : null}
          onChange={handleArtistSelect}
          onInputChange={handleInputChange}
          placeholder="Search for your artist name..."
          isLoading={isLoading}
          className="w-full"
        />

        {error && (
          <div className="text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {selectedArtist && (
          <div className="text-center">
            <Button
              onClick={() => handleArtistSelect(selectedArtist)}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Claim {selectedArtist.name}&apos;s Profile
            </Button>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-white/60">
          Don&apos;t see your artist? Make sure you have a verified Spotify artist profile.
        </p>
      </div>
    </div>
  );
} 