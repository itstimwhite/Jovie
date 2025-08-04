'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Logo } from '@/components/ui/Logo';
import { FEATURE_FLAGS } from '@/constants/app';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0D0E12]/95 backdrop-blur-sm supports-backdrop-filter:bg-[#0D0E12]/60">
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
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={FEATURE_FLAGS.waitlistEnabled ? '/waitlist' : '/sign-up'}
              className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 bg-white text-black hover:bg-white/90 focus:ring-white/50 px-3 py-1.5 text-sm hover:scale-105"
            >
              {FEATURE_FLAGS.waitlistEnabled ? 'Join Waitlist' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
