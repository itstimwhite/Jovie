import { createServerClient } from '@/lib/supabase-server';
import { Container } from '@/components/site/Container';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Root layout handles dynamic rendering
export const revalidate = 3600; // Revalidate every hour

export default async function ArtistsPage() {
  const supabase = await createServerClient();

  // Fetch all published artists
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, handle, name, image_url, tagline')
    .eq('published', true)
    .order('name');

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0E12]">
        <Container className="py-16">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">
              Error loading artists
            </h1>
            <p className="mt-4 text-white/70">Please try again later.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0E12]">
      <Container className="py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            All Artists
          </h1>
          <p className="mt-4 text-xl text-white/70">
            Discover amazing music artists and their profiles
          </p>
        </div>

        {/* Artists Grid */}
        {artists && artists.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/${artist.handle}`}
                className="group block text-center transition-all duration-300 hover:scale-105"
              >
                <div className="mx-auto mb-4 h-24 w-24">
                  <OptimizedImage
                    src={artist.image_url}
                    alt={`${artist.name} - Music Artist`}
                    size="xl"
                    shape="circle"
                    className="mx-auto"
                  />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {artist.name}
                </h3>

                {artist.tagline && (
                  <p className="mt-1 text-sm text-white/70 line-clamp-2">
                    {artist.tagline}
                  </p>
                )}

                <div className="mt-3 inline-flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Profile</span>
                  <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">
              No artists found
            </h2>
            <p className="mt-4 text-white/70">
              Check back later for new artist profiles.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
