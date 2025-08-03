'use client';

import { Container } from '@/components/site/Container';
import { FeatureFlaggedArtistSearch } from './FeatureFlaggedArtistSearch';

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16"
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="relative flex max-w-4xl flex-col items-center text-center">
        {/* Hero Section - Above the fold */}
        <div className="mb-16 space-y-8">
          {/* Badge - Moved social proof here */}
          <div
            className="inline-flex items-center rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xs ring-1 ring-white/20"
            role="status"
            aria-label="Key benefits"
          >
            <span
              className="mr-2 h-2 w-2 rounded-full bg-green-400"
              aria-hidden="true"
            />
            90-second setup • Free forever
          </div>

          {/* Main Headline - Split for visual hierarchy */}
          <h1
            id="hero-headline"
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            <span className="block text-white">The fastest link-in-bio</span>
            <span className="block text-accent">Built for musicians</span>
          </h1>

          {/* Subheadline - Tightened copy */}
          <p
            className="mx-auto max-w-2xl text-xl text-white sm:text-2xl leading-relaxed"
            role="doc-subtitle"
          >
            One link. Every stream.
          </p>
        </div>

        {/* Artist Search - Front and center */}
        <div className="w-full max-w-2xl" role="main">
          <FeatureFlaggedArtistSearch />
        </div>

        {/* Trust Indicators - Moved to bottom */}
        <div className="mt-12 text-center">
          <p
            className="text-sm text-white/50"
            role="complementary"
            aria-label="Security and payment information"
          >
            Secure • No credit card required
          </p>
        </div>
      </Container>
    </section>
  );
}
