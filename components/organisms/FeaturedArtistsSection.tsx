'use client';

import { SectionHeading } from '@/components/atoms/SectionHeading';
import { ArtistCard } from '@/components/molecules/ArtistCard';

export type FeaturedCreator = {
  id: string;
  handle: string;
  name: string;
  src: string;
  alt?: string;
};

export interface FeaturedCreatorsSectionProps {
  creators: FeaturedCreator[];
  title?: string;
  className?: string;
}

export function FeaturedCreatorsSection({
  creators,
  title = 'Featured Creators',
  className = '',
}: FeaturedCreatorsSectionProps) {
  return (
    <section
      aria-label="Featured creators"
      className={`relative py-12 md:py-16 ${className}`}
      data-testid="featured-creators"
    >
      <div className="container mx-auto px-4">
        <SectionHeading level={2} className="mb-12">
          {title}
        </SectionHeading>

        {/* Desktop: horizontal scroll */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-8 overflow-x-auto scroll-smooth pb-4">
            {creators.map((creator) => (
              <li key={creator.id} className="shrink-0">
                <ArtistCard
                  handle={creator.handle}
                  name={creator.name}
                  src={creator.src}
                  alt={creator.alt}
                  size="md"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: swipe */}
        <div className="md:hidden">
          <ul className="flex items-center gap-4 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {creators.map((creator) => (
              <li key={creator.id} className="shrink-0 first:ml-2 last:mr-2">
                <ArtistCard
                  handle={creator.handle}
                  name={creator.name}
                  src={creator.src}
                  alt={creator.alt}
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

// Export both names for compatibility during transition
export const FeaturedArtistsSection = FeaturedCreatorsSection;
