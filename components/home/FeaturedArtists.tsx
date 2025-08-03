import { createServerClient } from '@/lib/supabase-server';
import { ArtistCarousel } from './ArtistCarousel';

export async function FeaturedArtists() {
  const supabase = await createServerClient();

  // Fetch all published artists
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, handle, name, image_url, tagline')
    .eq('published', true)
    .order('name');

  if (error || !artists || artists.length === 0) {
    return null;
  }

  return <ArtistCarousel artists={artists} />;
}
