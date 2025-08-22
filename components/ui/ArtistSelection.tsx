'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Input } from './Input';
import { Button } from './Button';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface Artist {
  spotifyId: string;
  artistName: string;
  imageUrl?: string;
  followerCount?: number;
}

interface ArtistSelectionProps {
  selectedArtist: Artist | null;
  onArtistSelect: (artist: Artist | null) => void;
  onSearch?: (query: string) => Promise<Artist[]>;
  placeholder?: string;
  allowSkip?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ArtistSelection({
  selectedArtist,
  onArtistSelect,
  onSearch,
  placeholder = "Search for your artist...",
  allowSkip = true,
  disabled = false,
  className = '',
}: ArtistSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!onSearch || query.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        const results = await onSearch(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Artist search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(query);
      }, 300);
    },
    [handleSearch]
  );

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleArtistSelect = (artist: Artist) => {
    onArtistSelect(artist);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSkip = () => {
    onArtistSelect(null);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    onArtistSelect(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Artist Display */}
      {selectedArtist && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {selectedArtist.imageUrl && (
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={selectedArtist.imageUrl}
                  alt={selectedArtist.artistName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 truncate">
                {selectedArtist.artistName}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Spotify Artist Profile
                {selectedArtist.followerCount && (
                  <span className="ml-2">
                    {selectedArtist.followerCount.toLocaleString()} followers
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={handleClearSelection}
              variant="secondary"
              size="sm"
              disabled={disabled}
              className="flex-shrink-0"
            >
              Change
            </Button>
          </div>
        </div>
      )}

      {/* Search Input (only show if no artist selected) */}
      {!selectedArtist && (
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10"
            autoComplete="off"
          />
          
          {/* Search Icon/Spinner */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <LoadingSpinner size="sm" className="mx-auto mb-2" />
                  Searching artists...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((artist) => (
                    <button
                      key={artist.spotifyId}
                      onClick={() => handleArtistSelect(artist)}
                      disabled={disabled}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        {artist.imageUrl && (
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={artist.imageUrl}
                              alt={artist.artistName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {artist.artistName}
                          </p>
                          {artist.followerCount && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {artist.followerCount.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No artists found for "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Skip Option */}
      {allowSkip && !selectedArtist && (
        <div className="text-center">
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            I'll add this later
          </Button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Search for your artist to link your Spotify profile</p>
        <p>• This helps fans discover your music on Jovie</p>
        {allowSkip && <p>• You can always add this later in your settings</p>}
      </div>
    </div>
  );
}