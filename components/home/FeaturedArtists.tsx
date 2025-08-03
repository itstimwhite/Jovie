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
  <div className="flex flex-col items-center space-y-3 p-4">
    <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse" />
    <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
  </div>
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
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header with Linear-style typography */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
            Featured Artists
          </h2>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Join thousands of musicians already using Jovie to connect with
            their fans
          </p>
        </div>

        {/* Artist grid with Linear-style cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {(artists ?? Array.from({ length: 12 })).map((artist, idx) =>
            artist ? (
              <Link
                key={artist.id}
                href={`/${artist.handle}`}
                className="group flex flex-col items-center space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative">
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
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-200 truncate max-w-20">
                    {artist.name}
                  </p>
                </div>
              </Link>
            ) : (
              <Skeleton key={`sk-${idx}`} />
            )
          )}
        </div>

        {/* View all link with Linear styling */}
        <div className="mt-12 text-center">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all duration-200 font-medium"
          >
            View all artists
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedArtists;
