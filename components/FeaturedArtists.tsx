'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export type FeaturedArtist = {
  id: string;
  handle: string;
  name: string;
  src: string;
  alt?: string;
};

export default function FeaturedArtists({
  artists,
}: {
  artists: FeaturedArtist[];
}) {
  return (
    <section aria-label="Featured artists" className="relative py-8">
      {/* Simplified version for debugging - remove complex height and scroll animations */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Featured Creators
        </h2>

        {/* Desktop: horizontal scroll */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-10 overflow-x-auto scroll-smooth pb-4">
            {artists.map((a) => (
              <li key={a.id} className="shrink-0">
                <Link
                  href={`/${a.handle}`}
                  aria-label={`View ${a.name}'s profile`}
                  title={a.name}
                  className="group block cursor-pointer"
                >
                  <div className="text-center">
                    <OptimizedImage
                      src={a.src}
                      alt={a.alt ?? a.name}
                      width={160}
                      height={160}
                      aspectRatio="square"
                      objectFit="cover"
                      objectPosition="center"
                      priority={false}
                      quality={85}
                      placeholder="blur"
                      sizes="(max-width: 768px) 160px, 160px"
                      className="size-40 ring-1 ring-white/15 shadow-2xl group-hover:ring-white/25 mx-auto"
                      shape="circle"
                      artistName={a.name}
                      imageType="avatar"
                      enableVersioning={true}
                    />
                    <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {a.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: swipe */}
        <div className="md:hidden">
          <ul className="flex items-center gap-6 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artists.map((a) => (
              <li key={a.id} className="shrink-0 first:ml-2 last:mr-2">
                <Link
                  href={`/${a.handle}`}
                  aria-label={`View ${a.name}'s profile`}
                  title={a.name}
                  className="group block cursor-pointer"
                >
                  <div className="text-center">
                    <OptimizedImage
                      src={a.src}
                      alt={a.alt ?? a.name}
                      width={112}
                      height={112}
                      aspectRatio="square"
                      objectFit="cover"
                      objectPosition="center"
                      priority={false}
                      quality={85}
                      placeholder="blur"
                      sizes="(max-width: 768px) 112px, 112px"
                      className="size-28 ring-1 ring-black/10 dark:ring-white/15 shadow-lg group-hover:ring-white/25 mx-auto"
                      shape="circle"
                      artistName={a.name}
                      imageType="avatar"
                      enableVersioning={true}
                    />
                    <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {a.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
