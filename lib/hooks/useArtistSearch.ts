'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SpotifyArtist } from '@/types/common';

// Extend window interface for analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      event: string,
      properties?: Record<string, unknown>
    ) => void;
  }
}

interface UseArtistSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
}

interface UseArtistSearchReturn {
  results: SpotifyArtist[];
  isLoading: boolean;
  error: string | null;
  updateQuery: (query: string) => void;
}

// Client-side cache for search results
const searchCache = new Map<
  string,
  { data: SpotifyArtist[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useArtistSearch({
  debounceMs = 300,
  minQueryLength = 2,
  maxResults = 8,
}: UseArtistSearchOptions = {}): UseArtistSearchReturn {
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean up old cache entries
  useEffect(() => {
    const now = Date.now();
    const entries = Array.from(searchCache.entries());
    for (const [key, value] of entries) {
      if (now - value.timestamp > CACHE_TTL) {
        searchCache.delete(key);
      }
    }
  }, []);

  const searchArtists = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.length < minQueryLength) {
        setResults([]);
        setError(null);
        return;
      }

      // Check cache first
      const cacheKey = searchQuery.toLowerCase();
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setResults(cached.data.slice(0, maxResults));
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Cancel previous request
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();

      try {
        const startTime = performance.now();
        const response = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(searchQuery)}`,
          {
            signal: abortController.current?.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Search API response:', data);

        const searchResults = data || [];
        const duration = performance.now() - startTime;

        console.log(
          `Artist search took ${duration}ms for query: "${searchQuery}", found ${searchResults.length} results`
        );

        // Cache the results
        searchCache.set(cacheKey, {
          data: searchResults,
          timestamp: Date.now(),
        });

        // Keep cache size manageable
        if (searchCache.size > 100) {
          const firstKey = searchCache.keys().next().value;
          if (firstKey) {
            searchCache.delete(firstKey);
          }
        }

        setResults(searchResults.slice(0, maxResults));
        setError(null);

        // Track search analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'artist_search', {
            search_term: searchQuery,
            results_count: searchResults.length,
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }

        console.error('Artist search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [minQueryLength, maxResults]
  );

  const updateQuery = useCallback(
    (newQuery: string) => {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        searchArtists(newQuery);
      }, debounceMs);
    },
    [debounceMs, searchArtists]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    results,
    isLoading,
    error,
    updateQuery,
  };
}
