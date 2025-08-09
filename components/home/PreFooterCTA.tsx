'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';

export function PreFooterCTA() {
  const { isSignedIn } = useUser();
  const primaryHref = isSignedIn ? '/dashboard' : '/onboarding';
  const primaryLabel = isSignedIn ? 'Open app' : 'Get started';
  return (
    <section className="relative py-20 sm:py-24 border-t border-gray-200 dark:border-white/5 bg-gray-900 text-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="grid items-center gap-8 md:gap-10"
          style={{ gridTemplateColumns: '1.5fr 1fr' }}
        >
          <div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              <span>One link that turns followers into listeners.</span>
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-start sm:justify-end gap-3 sm:gap-4">
            <Button
              as={Link}
              href="mailto:support@jov.ie"
              variant="outline"
              size="md"
              className="backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
            >
              Contact support
            </Button>
            <Button
              as={Link}
              href={primaryHref}
              variant="primary"
              size="md"
              className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-white dark:text-gray-900"
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
