import { createClient } from '@supabase/supabase-js';
import FeaturedArtistsComponent, {
  type FeaturedArtist,
} from '@/components/FeaturedArtists';

interface DBCreatorProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url?: string | null;
  creator_type: string;
}

// Create an anonymous Supabase client for public data
function createAnonSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

async function getFeaturedArtists(): Promise<FeaturedArtist[]> {
  try {
    const supabase = createAnonSupabase();

    const { data, error } = await supabase
      .from('creator_profiles')
      .select('id, username, display_name, avatar_url, creator_type')
      .eq('is_public', true)
      .eq('creator_type', 'artist') // Only show artists for now
      .order('display_name')
      .limit(12);

    if (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }

    return (data as DBCreatorProfile[]).map((a) => ({
      id: a.id,
      handle: a.username,
      name: a.display_name || a.username,
      // Provide fallback avatar or use the existing one
      src: a.avatar_url || '/android-chrome-192x192.png', // Fallback to app icon
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
