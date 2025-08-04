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
    <section className="w-full py-12">
      <div className="w-full overflow-x-auto">
        <div className="flex flex-row gap-6 justify-center md:justify-between w-full min-w-[600px]">
          {(artists ?? Array.from({ length: 12 })).map((artist, idx) =>
            artist ? (
              <Link
                key={artist.id}
                href={`/${artist.handle}`}
                className="group flex items-center justify-center"
                title={artist.name}
              >
                {artist.image_url ? (
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-2 ring-white/20" />
                )}
              </Link>
            ) : (
              <div
                key={`sk-${idx}`}
                className="h-16 w-16 rounded-full bg-white/10 animate-pulse"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
