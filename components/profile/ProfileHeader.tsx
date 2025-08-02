import Image from 'next/image';
import { Artist } from '@/types/db';
import { DEFAULT_PROFILE_TAGLINE } from '@/constants/app';

interface ProfileHeaderProps {
  artist: Artist;
}

export function ProfileHeader({ artist }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      {artist.image_url && (
        <div className="relative h-32 w-32 overflow-hidden rounded-full">
          <Image
            src={artist.image_url}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{artist.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {artist.tagline || DEFAULT_PROFILE_TAGLINE}
        </p>
      </div>
    </div>
  );
}