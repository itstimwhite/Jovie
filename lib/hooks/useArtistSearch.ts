'use client';

import { useState, useCallback } from 'react';
import { searchSpotifyArtists } from '@/lib/spotify';

interface SearchResult {
  id: string;
  name: string;
  imageUrl?: string;
  popularity: number;
  followers?: number;
  spotifyUrl: string;
}

interface UseArtistSearchReturn {
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchArtists: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useArtistSearch(): UseArtistSearchReturn {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const spotifyArtists = await searchSpotifyArtists(query, 10);

      const results: SearchResult[] = spotifyArtists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url,
        popularity: artist.popularity,
        followers: artist.followers?.total,
        spotifyUrl: `https://open.spotify.com/artist/${artist.id}`,
      }));

      setSearchResults(results);
    } catch {
      setError('Failed to search artists');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchArtists,
    clearResults,
  };
}
