'use client';

import { Container } from '@/components/site/Container';
import { FeatureFlaggedArtistSearch } from './FeatureFlaggedArtistSearch';

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="relative flex max-w-6xl flex-col items-center text-center">
        {/* Linear-style badge with subtle glass morphism */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-gray-100/80 dark:bg-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white/80 backdrop-blur-sm border border-gray-200 dark:border-white/10"
            role="status"
            aria-label="Key benefits"
          >
            <div className="flex h-2 w-2 items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span>60-second setup</span>
            <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-white/30" />
            <span>Free forever</span>
          </div>
        </div>

        {/* Main headline with Linear's typography style */}
        <div className="mb-12 space-y-6">
          <h1
            id="hero-headline"
            className="text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white sm:text-7xl lg:text-8xl"
          >
            <span className="block leading-none">
              The fastest{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text">
                link-in-bio
              </span>
            </span>
            <span className="block leading-none text-gray-800 dark:text-white/90">
              for musicians
            </span>
          </h1>

          {/* Subtitle with better hierarchy */}
          <p
            className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-white/70 font-light leading-relaxed sm:text-2xl"
            role="doc-subtitle"
          >
            Turn your Spotify profile into a conversion machine.
            <br />
            <span className="text-gray-500 dark:text-white/50">
              One link. All your music.
            </span>
          </p>
        </div>

        {/* Artist Search with Linear-style container */}
        <div className="w-full max-w-2xl" role="main">
          <div className="relative">
            {/* Subtle glow effect behind search */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative">
              <FeatureFlaggedArtistSearch />
            </div>
          </div>
        </div>

        {/* Trust indicators with Linear styling */}
        <div className="mt-16 flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-white/50 font-medium">
            Trusted by musicians worldwide
          </p>
          <div className="flex items-center space-x-8 opacity-60">
            <div className="text-xs text-gray-400 dark:text-white/40 font-mono">
              10,000+ artists
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-white/20" />
            <div className="text-xs text-gray-400 dark:text-white/40 font-mono">
              1M+ clicks
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-white/20" />
            <div className="text-xs text-gray-400 dark:text-white/40 font-mono">
              99.9% uptime
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
