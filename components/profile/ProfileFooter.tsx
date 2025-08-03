import Link from 'next/link';
import { APP_NAME } from '@/constants/app';
import { Artist } from '@/types/db';
import { Logo } from '@/components/ui/Logo';

interface ProfileFooterProps {
  artist: Artist;
}

export function ProfileFooter({ artist }: ProfileFooterProps) {
  const hideBranding = artist.settings?.hide_branding || false;

  // Always render the footer container to prevent layout shift
  return (
    <footer
      className={`mt-12 border-t border-gray-200 pt-8 dark:border-gray-700 ${hideBranding ? 'hidden' : ''}`}
    >
      <div className="flex items-center justify-center">
        <Link
          href={`/?utm_source=profile&utm_artist=${artist.handle}`}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded"
          aria-label={`Create your own profile with ${APP_NAME}`}
        >
          <Logo size="xs" className="text-gray-500 dark:text-gray-400" />
          <span>Powered by {APP_NAME}</span>
        </Link>
      </div>
    </footer>
  );
}
