import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Artist } from '@/types/db';
import { DEFAULT_PROFILE_TAGLINE } from '@/constants/app';

interface ProfileHeaderProps {
  artist: Artist;
  subtitle?: string;
}

export function ProfileHeader({ artist, subtitle }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
      {/* Always render the image container to prevent layout shift */}
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        {/* Subtle radial gradient backdrop for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-full opacity-70 blur-xl dark:opacity-60"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.18), transparent 65%)',
          }}
        />
        <OptimizedImage
          src={artist.image_url}
          alt={`${artist.name} - Music Artist Profile Photo`}
          size="2xl"
          shape="circle"
          className="ring-1 ring-black/5 dark:ring-white/10 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)] transition-shadow"
          priority
          fill
          artistName={artist.name}
          imageType="avatar"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2 max-w-md">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white"
          itemProp="name"
        >
          <span className="flex items-center justify-center gap-2">
            <Link
              href={`/${artist.handle}`}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {artist.name}
            </Link>
            {artist.is_verified && <VerifiedBadge size="sm" />}
          </span>
        </h1>
        <p
          className="text-base sm:text-lg leading-snug text-gray-600 dark:text-gray-400 line-clamp-2"
          itemProp="description"
        >
          {subtitle ?? artist.tagline ?? DEFAULT_PROFILE_TAGLINE}
        </p>

        {/* Hidden SEO elements */}
        <meta itemProp="jobTitle" content="Music Artist" />
        <meta itemProp="worksFor" content="Music Industry" />
        <meta itemProp="knowsAbout" content="Music, Art, Entertainment" />
      </div>
    </header>
  );
}
