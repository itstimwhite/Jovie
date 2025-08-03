'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Logo } from '@/components/ui/Logo';
import { FEATURE_FLAGS } from '@/constants/app';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-backdrop-filter:bg-gray-900/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={FEATURE_FLAGS.waitlistEnabled ? '/waitlist' : '/sign-up'}
              className="inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 px-3 py-1.5 text-sm"
            >
              {FEATURE_FLAGS.waitlistEnabled ? 'Join Waitlist' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
