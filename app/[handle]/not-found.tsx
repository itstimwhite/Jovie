import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/site/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-8 text-center">
            {/* 404 Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                />
              </svg>
            </div>

            {/* 404 Message */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Artist not found
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                The artist profile you&apos;re looking for doesn&apos;t exist or
                hasn&apos;t been created yet.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Link href="/" className="flex-1">
                <Button variant="primary" className="w-full" size="lg">
                  Browse artists
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full" size="lg">
                  Go home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
