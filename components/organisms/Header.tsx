'use client';

import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { LogoLink } from '@/components/atoms/LogoLink';
import { AuthActions } from '@/components/molecules/AuthActions';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/10 dark:border-white/10 bg-white/95 dark:bg-[#0D0E12]/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-[#0D0E12]/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <LogoLink />
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </nav>
            <AuthActions />
          </div>
        </div>
      </Container>
    </header>
  );
}
