'use client';

import { SectionHeading } from '@/components/atoms/SectionHeading';
import { ArtistCard } from '@/components/molecules/ArtistCard';

export type FeaturedArtist = {
  id: string;
  handle: string;
  name: string;
  src: string;
  alt?: string;
};

export interface FeaturedArtistsSectionProps {
  artists: FeaturedArtist[];
  title?: string;
  className?: string;
}

export function FeaturedArtistsSection({
  artists,
  title = 'Featured Creators',
  className = '',
}: FeaturedArtistsSectionProps) {
  return (
    <section
      aria-label="Featured artists"
      className={`relative py-8 ${className}`}
    >
      <div className="container mx-auto px-4">
        <SectionHeading level={2} className="mb-8">
          {title}
        </SectionHeading>

        {/* Desktop: horizontal scroll */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-10 overflow-x-auto scroll-smooth pb-4">
            {artists.map((artist) => (
              <li key={artist.id} className="shrink-0">
                <ArtistCard
                  handle={artist.handle}
                  name={artist.name}
                  src={artist.src}
                  alt={artist.alt}
                  size="md"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: swipe */}
        <div className="md:hidden">
          <ul className="flex items-center gap-6 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artists.map((artist) => (
              <li key={artist.id} className="shrink-0 first:ml-2 last:mr-2">
                <ArtistCard
                  handle={artist.handle}
                  name={artist.name}
                  src={artist.src}
                  alt={artist.alt}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
