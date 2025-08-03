import Link from 'next/link';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { getCopyrightText, LEGAL } from '@/constants/app';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 py-12 md:h-20 md:flex-row md:py-0">
          <div className="flex flex-col items-center md:items-start space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>{getCopyrightText()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Made for musicians, by musicians
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href={LEGAL.privacyPath}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={LEGAL.termsPath}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
