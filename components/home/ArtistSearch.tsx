'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

export function ArtistSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just redirect to sign-up
      router.push('/sign-up');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your artist name..."
          className="w-full px-4 py-3 pl-12 pr-4 text-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          disabled={isSearching}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <LoadingSpinner size="sm" variant="light" />
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}
