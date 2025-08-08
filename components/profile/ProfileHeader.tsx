import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Artist } from '@/types/db';
import { DEFAULT_PROFILE_TAGLINE } from '@/constants/app';

interface ProfileHeaderProps {
  artist: Artist;
}

export function ProfileHeader({ artist }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center space-y-4 text-center">
      {/* Always render the image container to prevent layout shift */}
      <div className="relative h-32 w-32">
        <OptimizedImage
          src={artist.image_url}
          alt={`${artist.name} - Music Artist Profile Photo`}
          size="2xl"
          shape="circle"
          priority
          fill
        />
      </div>

      <div className="space-y-2">
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white"
          itemProp="name"
        >
          <span className="flex items-center justify-center gap-2">
            {artist.name}
            {artist.is_verified && <VerifiedBadge size="sm" />}
          </span>
        </h1>
        <p
          className="text-lg text-gray-600 dark:text-gray-400"
          itemProp="description"
        >
          {artist.tagline || DEFAULT_PROFILE_TAGLINE}
        </p>

        {/* Hidden SEO elements */}
        <meta itemProp="jobTitle" content="Music Artist" />
        <meta itemProp="worksFor" content="Music Industry" />
        <meta itemProp="knowsAbout" content="Music, Art, Entertainment" />
      </div>
    </header>
  );
}
