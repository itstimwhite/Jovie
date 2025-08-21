'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/organisms/HeroSection';
import { Button } from '@/components/ui/Button';

export function LinkInBioHero() {
  return (
    <HeroSection
      headline="Jovie: Built to Convert Not to Decorate"
      highlightText="Convert"
      gradientVariant="purple-cyan"
      subtitle="Your fans don't care about button colors—they care about your music. Jovie's AI tests every word, layout, and CTA behind the scenes to make sure more fans click, listen, and buy."
      icon="🚀"
      supportingText={
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
      }
      trustIndicators={
        <p className="text-xs text-gray-400 dark:text-white/40 font-medium">
          Trusted by 10,000+ artists worldwide
        </p>
      }
      showBackgroundEffects={false}
    >
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
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
    </HeroSection>
  );
}
