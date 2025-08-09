'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';

export function ProblemSection() {
  const handleClick = () => {
    track('claim_handle_click', { section: 'problem' });
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        Your bio link is a speed bump.
      </h2>
      <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-600 dark:text-white/70 text-balance">
        Every extra tap taxes attention. “Cute” layouts bleed streams, follows,
        and ticket sales.
      </p>
      <div className="mt-10">
        <Button
          as={Link}
          href="/onboarding"
          onClick={handleClick}
          variant="primary"
          size="md"
        >
          Claim your handle → Go live in 60s
        </Button>
      </div>
    </div>
  );
}
