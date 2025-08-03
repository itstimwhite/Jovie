import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';

interface Artist {
  id: string;
  handle: string;
  name: string;
  image_url?: string;
  tagline?: string;
}

async function getFeaturedArtists(): Promise<Artist[]> {
  const supabase = await createServerClient();
  
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, handle, name, image_url, tagline')
    .eq('published', true)
    .order('name');

  if (error) {
    console.error('Error fetching featured artists:', error);
    return [];
  }

  return artists || [];
}

export async function FeaturedArtists() {
  const artists = await getFeaturedArtists();

  if (!artists || artists.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Artists
            </h2>
            <p className="mt-4 text-lg text-white/80">
              No artists available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Featured Artists
          </h2>
          <p className="mt-4 text-lg text-white/80">
            See how musicians are using Jovie to connect with their fans
          </p>
        </div>

        {/* Artist Carousel */}
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/${artist.handle}`}
                className="flex-shrink-0 group"
              >
                <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-white/40">
                  {artist.image_url ? (
                    <img
                      src={artist.image_url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500 text-sm">{artist.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                    {artist.name}
                  </h3>
                  {artist.tagline && (
                    <p className="text-sm text-white/70 mt-1 line-clamp-2">
                      {artist.tagline}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Artists Link */}
        <div className="text-center mt-8">
          <Link
            href="/artists"
            className="inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/20 transition-all duration-200"
          >
            View All Artists
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
