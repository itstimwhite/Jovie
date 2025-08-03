'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/site/Container';

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16"
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="flex max-w-4xl flex-col items-center text-center">
        {/* Hero Section - Above the fold */}
        <div className="mb-12 space-y-6">
          {/* Badge */}
          <div
            className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20"
            role="status"
            aria-label="Setup time"
          >
            <span
              className="mr-2 h-2 w-2 rounded-full bg-green-400"
              aria-hidden="true"
            />
            90-second setup
          </div>

          {/* Main Headline */}
          <h1
            id="hero-headline"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            <span className="block">
              The fastest link-in-bio for musicians.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto max-w-2xl text-xl text-white/80 sm:text-2xl"
            role="doc-subtitle"
          >
            One optimized design loads instantly and converts consistently.
            While others waste time customizing, you&apos;ll be gaining streams.
          </p>

          {/* Social Proof */}
          <div
            className="flex items-center justify-center space-x-8 text-sm text-white/60"
            role="complementary"
            aria-label="Key benefits"
          >
            <span>Free forever</span>
            <span aria-hidden="true">•</span>
            <span>High converting</span>
          </div>
        </div>

        {/* Simple CTA */}
        <div className="w-full max-w-2xl space-y-6" role="main">
          <div className="flex justify-center">
            <Button
              onClick={() => (window.location.href = '/sign-in')}
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              Get Started
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p
              className="text-sm text-white/50"
              role="complementary"
              aria-label="Security and payment information"
            >
              Secure • No credit card
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
