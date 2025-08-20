// Legacy component - use FeaturedArtistsSection from organisms instead
import {
  FeaturedArtistsSection,
  type FeaturedArtist,
} from '@/components/organisms/FeaturedArtistsSection';

export type { FeaturedArtist };

export default function FeaturedArtists({
  artists,
}: {
  artists: FeaturedArtist[];
}) {
  return <FeaturedArtistsSection artists={artists} />;
}
