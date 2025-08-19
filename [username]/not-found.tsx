import Link from 'next/link';
import { Container } from '@/components/site/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">
              404
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Artist not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The artist profile you&apos;re looking for doesn&apos;t exist or
              isn&apos;t public.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go home
          </Link>
        </div>
      </Container>
    </div>
  );
}
