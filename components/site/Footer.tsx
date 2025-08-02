import Link from 'next/link';
import { Container } from './Container';
import { getCopyrightText, LEGAL } from '@/constants/app';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:h-16 md:flex-row md:py-0">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <p>{getCopyrightText()}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link
              href={LEGAL.privacyPath}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Privacy
            </Link>
            <Link
              href={LEGAL.termsPath}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
