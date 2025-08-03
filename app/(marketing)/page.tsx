'use client';

/**
 * Homepage for claiming an artist profile via Spotify search.
 */

import { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
import { Container } from '@/components/site/Container';
import type { SpotifyArtist } from '@/types/common';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [selected, setSelected] = useState<SpotifyArtist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clerk = useClerk();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          setResults(await res.json());
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

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
  const comboboxOptions = results.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Container className="flex max-w-4xl flex-col items-center text-center">
          {/* Hero Section - Above the fold */}
          <div className="mb-12 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-400" />
              Live in under 90 seconds
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">The world&apos;s best</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                link in bio
              </span>
              <span className="block">for music artists</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto max-w-2xl text-xl text-white/80 sm:text-2xl">
              Create a stunning, high-converting landing page that connects all
              your music, social media, and merch in one beautiful link.
              <span className="font-semibold text-white">
                {' '}
                No design skills needed.
              </span>
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-white/60">
              <span>✨ Free forever</span>
              <span>•</span>
              <span>⚡ 90-second setup</span>
              <span>•</span>
              <span>🎯 High converting</span>
            </div>
          </div>

          {/* Artist Selection - Above the fold */}
          <div className="w-full max-w-2xl space-y-6">
            {/* Search Label */}
            <div className="text-center">
              <label className="text-lg font-semibold text-white">
                Find your artist profile
              </label>
              <p className="mt-1 text-sm text-white/60">
                Search for your artist name on Spotify to get started
              </p>
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
                onInputChange={setQuery}
                placeholder="Search for your artist name..."
                disabled={isLoading}
              />
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
                  'Select an artist to continue'
                )}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-sm text-white/50">
                Secure • Private • No credit card required
              </p>
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
                Lightning Fast
              </h3>
              <p className="text-sm text-white/70">
                Get your profile live in under 90 seconds
              </p>
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
              <p className="text-sm text-white/70">
                Optimized for maximum engagement and sales
              </p>
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
              <h3 className="mb-2 text-lg font-semibold text-white">
                Analytics
              </h3>
              <p className="text-sm text-white/70">
                Track your profile views and engagement
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
