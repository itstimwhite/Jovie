import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Logo } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60'>
        <Container>
          <div className='flex h-16 items-center justify-between'>
            <Link href='/' className='flex items-center space-x-2'>
              <Logo size='sm' />
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        <Container>
          <div className='flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4'>
            {/* 404 Number */}
            <div className='relative mb-8'>
              <h1 className='text-9xl font-bold text-gray-200 dark:text-gray-800 tracking-tighter'>
                404
              </h1>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-6xl font-bold text-gray-900 dark:text-white tracking-tighter'>
                  404
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className='max-w-2xl mx-auto space-y-6'>
              <h2 className='text-3xl font-semibold text-gray-900 dark:text-white tracking-tight'>
                Page not found
              </h2>

              <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
                The page you&apos;re looking for doesn&apos;t exist. It might
                have been moved, deleted, or you entered the wrong URL.
              </p>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
                <Link
                  href='/'
                  className='inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus-visible:ring-gray-500/50 px-6 py-3 text-base hover:scale-105'
                >
                  Go back home
                </Link>

                <Link
                  href='/artists'
                  className='inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-gray-500/50 px-6 py-3 text-base'
                >
                  Browse artists
                </Link>
              </div>

              {/* Helpful Links */}
              <div className='pt-8 border-t border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                  Looking for something specific?
                </p>
                <div className='flex flex-wrap items-center justify-center gap-4 text-sm'>
                  <Link
                    href='/dashboard'
                    className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                  >
                    Dashboard
                  </Link>
                  <span className='text-gray-300 dark:text-gray-600'>•</span>
                  <Link
                    href='/onboarding'
                    className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                  >
                    Get started
                  </Link>
                  <span className='text-gray-300 dark:text-gray-600'>•</span>
                  <Link
                    href='/waitlist'
                    className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                  >
                    Join waitlist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className='border-t border-gray-200/50 dark:border-white/10 bg-white dark:bg-gray-900'>
        <Container>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6 py-8 md:h-16 md:py-0 w-full'>
            <div className='flex flex-col items-center md:items-start space-y-2 text-sm text-gray-500 dark:text-gray-400'>
              <p>© 2024 Jovie. All rights reserved.</p>
              <p className='text-xs text-gray-400 dark:text-gray-500'>
                Made for musicians, by musicians
              </p>
            </div>
            <div className='flex items-center space-x-6 text-sm md:ml-auto'>
              <Link
                href='/legal/privacy'
                className='text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Privacy
              </Link>
              <Link
                href='/legal/terms'
                className='text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
