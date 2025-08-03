'use client';

import { useState, useMemo } from 'react';
import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
import { Container } from '@/components/site/Container';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';
import type { SpotifyArtist } from '@/types/common';
import clsx from 'clsx';

export function HomeHero() {
  const [selected, setSelected] = useState<SpotifyArtist | null>(null);
  const clerk = useClerk();

  const { results, isLoading, error, updateQuery } = useArtistSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 8,
  });

  const handleClaim = () => {
    if (selected && clerk) {
      const destination = `/dashboard?artistId=${encodeURIComponent(
        selected.id
      )}`;
      clerk.redirectToSignIn({
        signInFallbackRedirectUrl: destination,
      });
    }
  };

  // Convert SpotifyArtist to ComboboxOption format
  const comboboxOptions = useMemo(
    () =>
      results.map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url,
      })),
    [results]
  );

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <Container className="flex max-w-4xl flex-col items-center text-center">
        {/* Hero Section - Above the fold */}
        <div className="mb-12 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-400" />
            90-second setup
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Link in bio</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              for music artists
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-xl text-white/80 sm:text-2xl">
            Connect your music, social media, and merch in one link.
            <span className="font-semibold text-white"> No design needed.</span>
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-white/60">
            <span>Free forever</span>
            <span>•</span>
            <span>High converting</span>
          </div>
        </div>

        {/* Artist Selection - Above the fold */}
        <div className="w-full max-w-2xl space-y-6">
          {/* Search Label */}
          <div className="text-center">
            <label className="text-lg font-semibold text-white">
              Find your artist
            </label>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Combobox
              options={comboboxOptions}
              value={
                selected
                  ? {
                      id: selected.id,
                      name: selected.name,
                      imageUrl: selected.images?.[0]?.url,
                    }
                  : null
              }
              onChange={(option) => {
                if (option) {
                  const artist = results.find((r) => r.id === option.id);
                  setSelected(artist || null);
                } else {
                  setSelected(null);
                }
              }}
              onInputChange={updateQuery}
              placeholder="Search artists..."
              disabled={isLoading}
              isLoading={isLoading}
              maxDisplayedOptions={8}
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          {/* Claim Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleClaim}
              disabled={!selected}
              color="indigo"
              size="lg"
              className={clsx(
                'relative overflow-hidden px-8 py-4 text-lg font-semibold transition-all duration-300',
                selected
                  ? 'scale-105 shadow-2xl shadow-indigo-500/25'
                  : 'opacity-50'
              )}
            >
              {selected ? (
                <>
                  <span className="relative z-10">Claim {selected.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </>
              ) : (
                'Select artist'
              )}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">Secure • No credit card</p>
          </div>
        </div>

        {/* Features Preview - Below the fold */}
        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Fast Setup
            </h3>
            <p className="text-sm text-white/70">Live in 90 seconds</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              High Converting
            </h3>
            <p className="text-sm text-white/70">Optimized for engagement</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Analytics</h3>
            <p className="text-sm text-white/70">Track views and engagement</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
