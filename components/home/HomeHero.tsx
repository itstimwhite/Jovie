'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { ClaimHandleForm } from './ClaimHandleForm';
import { Button } from '@/components/ui/Button';
import { useFeatureFlagWithLoading, FEATURE_FLAGS } from '@/lib/analytics';

export function HomeHero({ subtitle }: { subtitle?: ReactNode }) {
  const { enabled: showClaimHandle, loading } = useFeatureFlagWithLoading(
    FEATURE_FLAGS.CLAIM_HANDLE,
    false
  );
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="relative flex max-w-4xl flex-col items-center text-center">
        {/* Big welcoming H1 */}
        <div className="mb-6 space-y-4">
          <h1
            id="hero-headline"
            className="text-5xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]"
          >
            <span className="block">
              Claim your{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text">
                handle
              </span>
            </span>
          </h1>

          {/* Concise subhead */}
          <p
            className="mx-auto max-w-lg text-lg text-gray-600 dark:text-white/70 font-normal leading-relaxed sm:text-xl"
            role="doc-subtitle"
          >
            {subtitle ?? 'Your personalized link in bio, ready in seconds.'}
          </p>
        </div>

        {/* Single frosted card with subtle depth */}
        <div className="w-full max-w-xl" role="main">
          <div className="relative group">
            {/* Subtle parallax glow effect (very light) */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

            {/* Frosted card with 12-16px radius and soft shadow */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 p-8">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ) : showClaimHandle ? (
                <ClaimHandleForm />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    Create your artist page in seconds.
                  </p>
                  <Button as={Link} href="/sign-up" size="lg">
                    Sign up to get started
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Supporting text under card */}
          <p className="mt-6 text-sm text-gray-500 dark:text-white/50 text-center">
            Go live in 60 seconds • Free forever
          </p>
        </div>

        {/* Reduced footer padding - Trust indicators */}
        <div className="mt-12 flex flex-col items-center space-y-3">
          <p className="text-xs text-gray-400 dark:text-white/40 font-medium">
            Trusted by 10,000+ artists worldwide
          </p>
        </div>
      </Container>
    </section>
  );
}
