'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/organisms/HeroSection';
import { ClaimHandleForm } from './ClaimHandleForm';
import { Button } from '@/components/ui/Button';
import { useFeatureFlagWithLoading, FEATURE_FLAGS } from '@/lib/analytics';

export function HomeHero({ subtitle }: { subtitle?: ReactNode }) {
  const { enabled: showClaimHandle, loading } = useFeatureFlagWithLoading(
    FEATURE_FLAGS.CLAIM_HANDLE,
    false
  );

  const defaultSubtitle =
    subtitle ?? 'Your personalized link in bio, ready in seconds.';

  const content = loading ? (
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
  );

  return (
    <HeroSection
      headline="Claim your handle"
      highlightText="handle"
      gradientVariant="primary"
      subtitle={defaultSubtitle}
      supportingText="Go live in 60 seconds • Free forever"
      trustIndicators={
        <p className="text-xs text-gray-400 dark:text-white/40 font-medium">
          Trusted by 10,000+ artists worldwide
        </p>
      }
    >
      {content}
    </HeroSection>
  );
}
