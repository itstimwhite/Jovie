'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/site/Container';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Artist profile error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
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

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Something went wrong!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an error while loading this artist profile.
                Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                    Error details
                  </summary>
                  <pre className="mt-2 rounded bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button onClick={() => reset()} className="flex-1" size="lg">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                Go home
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
