'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase';

interface Artist {
  id: string;
  handle: string;
  name: string;
  image_url?: string;
}

const Skeleton = () => (
  <div className="h-16 w-16 shrink-0 rounded-full bg-slate-400/20 animate-pulse snap-center" />
);

export function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[] | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from('artists')
        .select('id, handle, name, image_url')
        .eq('published', true)
        .order('name');
      setArtists(data || []);
    })();
  }, []);

  return (
    <section className="relative bg-linear-to-b from-indigo-600/90 to-pink-600/90 py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {(artists ?? Array.from({ length: 12 })).map((artist, idx) =>
            artist ? (
              <Link
                key={artist.id}
                href={`/${artist.handle}`}
                className="h-16 w-16 shrink-0 snap-center transform transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-105"
              >
                {artist.image_url ? (
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <Skeleton />
                )}
              </Link>
            ) : (
              <Skeleton key={`sk-${idx}`} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedArtists;
