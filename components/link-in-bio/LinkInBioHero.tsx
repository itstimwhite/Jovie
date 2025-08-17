'use client';

import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Button } from '@/components/ui/Button';

export function LinkInBioHero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="relative flex max-w-5xl flex-col items-center text-center">
        {/* Rocket emoji and main headline */}
        <div className="mb-8 space-y-6">
          <div className="text-6xl mb-4" role="img" aria-label="rocket">
            🚀
          </div>

          <h1
            id="hero-headline"
            className="text-5xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]"
          >
            <span className="block">
              Jovie: Built to{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text">
                Convert
              </span>
            </span>
            <span className="block mt-2">Not to Decorate</span>
          </h1>

          {/* Concise subhead */}
          <p
            className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-white/70 font-normal leading-relaxed sm:text-2xl"
            role="doc-subtitle"
          >
            Your fans don&apos;t care about button colors—they care about your
            music. Jovie&apos;s AI tests every word, layout, and CTA behind the
            scenes to make sure more fans click, listen, and buy.
          </p>
        </div>

        {/* CTA buttons with enhanced spacing and interactions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            as={Link}
            href="/onboarding"
            size="lg"
            variant="primary"
            className="text-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-indigo-400/25"
          >
            Create Your Profile
          </Button>

          <Button
            as={Link}
            href="/pricing"
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4 transition-all duration-300 hover:scale-105"
          >
            View Pricing
          </Button>
        </div>

        {/* Supporting text under buttons */}
        <div className="mt-8 flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm">
            You focus on creating. We focus on converting.
          </span>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col items-center space-y-3">
          <p className="text-xs text-gray-400 dark:text-white/40 font-medium">
            Trusted by 10,000+ artists worldwide
          </p>
        </div>
      </Container>
    </section>
  );
}
