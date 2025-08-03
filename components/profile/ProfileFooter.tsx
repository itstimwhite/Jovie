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
      <div className="flex flex-col items-center justify-center space-y-2">
        <Link
          href={`/?utm_source=profile&utm_artist=${artist.handle}`}
          aria-label={`Create your own profile with ${APP_NAME}`}
          className="focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-sm"
        >
          <Logo
            size="sm"
            className="text-gray-500 dark:text-gray-400 mx-auto"
          />
        </Link>
        <Link
          href={`/?utm_source=profile&utm_artist=${artist.handle}`}
          className="text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          Claim your profile
        </Link>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Made for musicians, by musicians
        </span>

        {/* Subtle legal links */}
        <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/legal/privacy"
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
          <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
          <Link
            href="/legal/terms"
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
