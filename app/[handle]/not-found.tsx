import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
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

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Artist not found
              </h1>

              <p className="text-gray-600 dark:text-gray-400">
                This artist profile doesn&apos;t exist or hasn&apos;t been
                published yet.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <Link href="/">
                <Button color="indigo" className="w-full">
                  Find an artist
                </Button>
              </Link>

              <Link href="/">
                <Button color="gray" outline className="w-full">
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
