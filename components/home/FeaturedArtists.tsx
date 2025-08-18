import { createServerClient } from '@/lib/supabase-server';
import FeaturedArtistsComponent, {
  type FeaturedArtist,
} from '@/components/FeaturedArtists';

interface DBArtistProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url?: string | null;
}

async function getFeaturedArtists(): Promise<FeaturedArtist[]> {
  try {
    const supabase = await createServerClient();

    if (!supabase) {
      console.warn('Supabase server client not available');
      return [];
    }

    const { data, error } = await supabase
      .from('artist_profiles')
      .select('id, username, display_name, avatar_url')
      .eq('is_public', true)
      .order('display_name')
      .limit(12);

    if (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }

    return (data as DBArtistProfile[])
      .filter((a) => a.avatar_url) // Only show artists with avatars
      .map((a) => ({
        id: a.id,
        handle: a.username,
        name: a.display_name || a.username,
        src: a.avatar_url as string,
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
