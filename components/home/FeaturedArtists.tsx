'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Artist {
  id: string;
  handle: string;
  name: string;
  image_url?: string;
}

export function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createBrowserClient();

        if (!supabase) {
          console.error('Database connection failed');
          setArtists([]);
          return;
        }

        const { data, error } = await supabase
          .from('artists')
          .select('id, handle, name, image_url')
          .eq('published', true)
          .order('name');

        if (error) {
          console.error('Error fetching artists:', error);
          setArtists([]);
        } else {
          setArtists((data as unknown as Artist[]) || []);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="w-full overflow-x-auto">
          <div className="flex flex-row gap-6 justify-center md:justify-between w-full min-w-[600px]">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={`loading-${idx}`}
                className="h-16 w-16 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse ring-2 ring-gray-300 dark:ring-white/20"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="w-full overflow-x-auto">
        <div className="flex flex-row gap-6 justify-center md:justify-between w-full min-w-[600px]">
          {artists?.map((artist) => (
            <Link
              key={artist.id}
              href={`/${artist.handle}`}
              className="group flex items-center justify-center"
              title={artist.name}
            >
              <div className="relative">
                <OptimizedImage
                  src={artist.image_url}
                  alt={`${artist.name} - Music Artist`}
                  size="lg"
                  shape="circle"
                  className="ring-2 ring-gray-300 dark:ring-white/20 group-hover:ring-gray-400 dark:group-hover:ring-white/40 transition-all duration-200"
                />

                {/* Hover overlay with artist name */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-medium text-center px-2">
                    {artist.name}
                  </span>
                </div>
              </div>
            </Link>
          )) || (
            // Fallback if no artists are found
            <div className="flex items-center justify-center w-full">
              <div className="text-gray-500 dark:text-white/60 text-sm">
                No artists available
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
