'use client';

import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { APP_NAME } from '@/constants/app';

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold">{APP_NAME}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            ) : (
              <Link href="/sign-in" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
