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
  showTitle?: boolean;
  showNames?: boolean;
}

export function FeaturedCreatorsSection({
  creators,
  title = 'Featured Creators',
  className = '',
  showTitle = true,
  showNames = true,
}: FeaturedCreatorsSectionProps) {
  return (
    <section
      aria-label='Featured creators'
      className={`relative py-8 md:py-12 ${className}`}
      data-testid='featured-creators'
    >
      <div className='container mx-auto px-4'>
        <SectionHeading
          level={2}
          className={`mb-8 ${showTitle ? '' : 'sr-only'}`}
        >
          {title}
        </SectionHeading>

        {/* Desktop: horizontal scroll with fade */}
        <div className='hidden md:block relative'>
          {/* Left fade gradient */}
          <div className='absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white dark:from-[#0D0E12] to-transparent z-10 pointer-events-none' />

          {/* Right fade gradient */}
          <div className='absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white dark:from-[#0D0E12] to-transparent z-10 pointer-events-none' />

          <ul className='flex items-center gap-8 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {creators.map(creator => (
              <li key={creator.id} className='shrink-0 first:ml-4 last:mr-8'>
                <ArtistCard
                  handle={creator.handle}
                  name={creator.name}
                  src={creator.src}
                  alt={creator.alt}
                  size='md'
                  showName={showNames}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: swipe with fade */}
        <div className='md:hidden relative'>
          {/* Left fade gradient - mobile */}
          <div className='absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-[#0D0E12] to-transparent z-10 pointer-events-none' />

          {/* Right fade gradient - mobile */}
          <div className='absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-[#0D0E12] to-transparent z-10 pointer-events-none' />

          <ul className='flex items-center gap-4 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {creators.map(creator => (
              <li key={creator.id} className='shrink-0 first:ml-2 last:mr-8'>
                <ArtistCard
                  handle={creator.handle}
                  name={creator.name}
                  src={creator.src}
                  alt={creator.alt}
                  size='sm'
                  showName={showNames}
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
