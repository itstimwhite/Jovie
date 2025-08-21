import { ArtistAvatar } from '@/components/atoms/ArtistAvatar';
import { ArtistName } from '@/components/atoms/ArtistName';
import { DEFAULT_PROFILE_TAGLINE } from '@/constants/app';
import { Artist } from '@/types/db';

interface ArtistInfoProps {
  artist: Artist;
  subtitle?: string;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  nameSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ArtistInfo({
  artist,
  subtitle,
  avatarSize = 'xl',
  nameSize = 'lg',
  className = '',
}: ArtistInfoProps) {
  return (
    <div
      className={`flex flex-col items-center space-y-3 sm:space-y-4 text-center ${className}`}
    >
      <ArtistAvatar
        src={artist.image_url || ''}
        alt={artist.name}
        name={artist.name}
        size={avatarSize}
      />

      <div className="space-y-1.5 sm:space-y-2 max-w-md">
        <ArtistName
          name={artist.name}
          handle={artist.handle}
          isVerified={artist.is_verified}
          size={nameSize}
        />

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
    </div>
  );
}
