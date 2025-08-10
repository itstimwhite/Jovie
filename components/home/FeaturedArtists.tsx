import { createServerClient } from '@/lib/supabase-server';
import FeaturedArtistsComponent, {
  type FeaturedArtist,
} from '@/components/FeaturedArtists';

interface DBArtist {
  id: string;
  handle: string;
  name: string;
  image_url?: string | null;
}

async function getFeaturedArtists(): Promise<FeaturedArtist[]> {
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

    return (data as DBArtist[])
      .filter((a) => a.image_url)
      .map((a) => ({
        id: a.id,
        handle: a.handle,
        name: a.name,
        src: a.image_url as string,
      }));
  } catch (error) {
    console.error('Error fetching featured artists:', error);
    return [];
  }
}

export async function FeaturedArtists() {
  const artists = await getFeaturedArtists();
  if (!artists.length) return null;
  return <FeaturedArtistsComponent artists={artists} />;
}
