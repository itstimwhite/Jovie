'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/sign-in" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
