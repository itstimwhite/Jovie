import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Artist {
  id: string;
  handle: string;
  name: string;
  image_url?: string;
}

async function getFeaturedArtists(): Promise<Artist[]> {
  try {
    const supabase = await createServerClient();

    if (!supabase) {
      console.warn('Supabase server client not available');
      return [];
    }

    const { data, error } = await supabase
      .from('artists')
      .select('id, handle, name, image_url')
      .eq('published', true)
      .order('name')
      .limit(12);

    if (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }

    return (data as Artist[]) || [];
  } catch (error) {
    console.error('Error fetching featured artists:', error);
    return [];
  }
}

export async function FeaturedArtists() {
  const artists = await getFeaturedArtists();

  if (artists.length === 0) {
    return (
      <section
        data-testid="featured-artists"
        aria-label="Featured artists"
        className="w-full py-12"
      >
        <p className="text-center text-sm text-gray-500 dark:text-white/60">
          No featured artists yet. Check back soon.
        </p>
      </section>
    );
  }

  return (
    <section
      data-testid="featured-artists"
      aria-label="Featured artists"
      className="w-full py-12"
    >
      <ul className="flex w-full overflow-x-auto gap-6 justify-center md:justify-between scroll-smooth">
        {artists.map((artist) => (
          <li key={artist.id} className="flex-shrink-0">
            <Link
              href={`/${artist.handle}`}
              className="group block focus:outline-none"
              aria-label={`View ${artist.name}'s profile`}
            >
              <div className="relative">
                <OptimizedImage
                  src={artist.image_url}
                  alt={`${artist.name} - Music Artist`}
                  size="lg"
                  shape="circle"
                  className="ring-2 ring-gray-300 dark:ring-white/20 group-hover:ring-gray-400 dark:group-hover:ring-white/40 group-focus-visible:ring-gray-400 dark:group-focus-visible:ring-white/40 transition-all duration-200"
                />

                {/* Hover overlay with artist name */}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="px-2 text-center text-xs font-medium text-white">
                    {artist.name}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
