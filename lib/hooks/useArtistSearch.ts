import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpotifyArtist } from '@/types/common';
import { measureAsync } from '@/lib/utils/performance';

interface UseArtistSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
}

interface SearchCache {
  [query: string]: {
    results: SpotifyArtist[];
    timestamp: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MIN_QUERY_LENGTH = 2;
const DEFAULT_MAX_RESULTS = 10;

export function useArtistSearch(options: UseArtistSearchOptions = {}) {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
    maxResults = DEFAULT_MAX_RESULTS,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cache = useRef<SearchCache>({});
  const abortController = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchArtists = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        setError(null);
        return;
      }

      // Check cache first
      const cached = cache.current[searchQuery];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setResults(cached.results);
        setError(null);
        return;
      }

      // Cancel previous request
      if (abortController.current) {
        abortController.current.abort();
      }

      // Create new abort controller
      abortController.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const data = await measureAsync('spotify-search', async () => {
          const res = await fetch(
            `/api/spotify/search?q=${encodeURIComponent(searchQuery)}`,
            {
              signal: abortController.current?.signal,
            }
          );

          if (!res.ok) {
            throw new Error(`Search failed: ${res.status}`);
          }

          return res.json();
        });

        const limitedResults = data.slice(0, maxResults);

        // Cache the results
        cache.current[searchQuery] = {
          results: limitedResults,
          timestamp: Date.now(),
        };

        setResults(limitedResults);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }

        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [minQueryLength, maxResults]
  );

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        searchArtists(searchQuery);
      }, debounceMs);
    },
    [searchArtists, debounceMs]
  );

  const updateQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const clearCache = useCallback(() => {
    cache.current = {};
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    updateQuery,
    clearResults,
    clearCache,
  };
}
