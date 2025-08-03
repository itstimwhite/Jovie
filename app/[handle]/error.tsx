'use client';

import { useEffect } from 'react';
import { Container } from '@/components/site/Container';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Artist profile error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400">
                We couldn&apos;t load this artist profile. Please try again.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <Button onClick={reset} color="indigo">
                Try again
              </Button>

              <Button onClick={() => (window.location.href = '/')} outline>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
