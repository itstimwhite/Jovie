import Link from 'next/link';
import { APP_NAME, APP_URL } from '@/constants/app';
import { Artist } from '@/types/db';

interface ProfileFooterProps {
  artist: Artist;
}

export function ProfileFooter({ artist }: ProfileFooterProps) {
  const hideBranding = artist.settings?.hide_branding || false;

  if (hideBranding) {
    return null;
  }

  const utmUrl = `${APP_URL}?utm_source=profile&utm_artist=${artist.handle}`;

  return (
    <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
      <div className="flex items-center justify-center">
        <Link
          href={utmUrl}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Powered by {APP_NAME}</span>
        </Link>
      </div>
    </footer>
  );
}
