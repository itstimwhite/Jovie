import Link from 'next/link';
import { APP_NAME, FEATURE_FLAGS } from '@/constants/app';
import { Artist } from '@/types/db';
import { Logo } from '@/components/ui/Logo';
import BrandingBadge from '@/components/BrandingBadge';

interface ProfileFooterProps {
  artist: Artist;
}

export function ProfileFooter({ artist }: ProfileFooterProps) {
  return (
    <footer className="mt-auto border-t border-gray-200 pt-8 dark:border-gray-700">
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Branding badge controlled by Clerk plan */}
        <BrandingBadge />

        <Link
          href={`/?utm_source=profile&utm_artist=${artist.handle}`}
          aria-label={`Create your own profile with ${APP_NAME}`}
          className="focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-sm"
        >
          <Logo
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          />
        </Link>
        <Link
          href={
            FEATURE_FLAGS.waitlistEnabled
              ? `/waitlist?utm_source=profile&utm_artist=${artist.handle}`
              : `/sign-up?utm_source=profile&utm_artist=${artist.handle}`
          }
          className="text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          Claim your profile now
        </Link>

        {/* Privacy link only */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/legal/privacy"
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
