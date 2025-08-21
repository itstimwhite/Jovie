import { ArtistInfo } from '@/components/molecules/ArtistInfo';
import { Artist } from '@/types/db';

interface ProfileHeaderProps {
  artist: Artist;
  subtitle?: string;
}

export function ProfileHeader({ artist, subtitle }: ProfileHeaderProps) {
  return (
    <header itemScope itemType="https://schema.org/Person">
      <ArtistInfo
        artist={artist}
        subtitle={subtitle}
        avatarSize="2xl"
        nameSize="lg"
      />
    </header>
  );
}
