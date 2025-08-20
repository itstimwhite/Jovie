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
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || // New standard key
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Fallback to deprecated key

  return createClient(supabaseUrl, supabaseKey);
}

async function getFeaturedCreators(): Promise<FeaturedArtist[]> {
  try {
    console.log('[FeaturedCreators] Starting to fetch featured creators...');
    const supabase = createAnonSupabase();

    const { data, error } = await supabase
      .from('creator_profiles')
      .select('id, username, display_name, avatar_url, creator_type')
      .eq('is_public', true)
      .eq('is_featured', true)
      .eq('marketing_opt_out', false) // Only include creators who haven't opted out
      .order('display_name')
      .limit(12);

    console.log('[FeaturedCreators] Query result:', {
      error: error?.message || null,
      count: data?.length || 0,
      creators: data?.map((a) => a.username) || [],
    });

    if (error) {
      console.error('Error fetching featured creators:', error);
      return [];
    }

    const mappedCreators = (data as DBCreatorProfile[]).map((a) => ({
      id: a.id,
      handle: a.username,
      name: a.display_name || a.username,
      // Provide fallback avatar or use the existing one
      src: a.avatar_url || '/android-chrome-192x192.png', // Fallback to app icon
    }));

    console.log(
      '[FeaturedCreators] Mapped creators:',
      mappedCreators.map((a) => ({
        handle: a.handle,
        name: a.name,
        src: a.src,
      }))
    );

    console.log(
      '[FeaturedCreators] Returning',
      mappedCreators.length,
      'creators'
    );
    return mappedCreators;
  } catch (error) {
    console.error('Error fetching featured creators:', error);
    return [];
  }
}

export async function FeaturedArtists() {
  const creators = await getFeaturedCreators();
  if (!creators.length) return null;
  return <FeaturedArtistsComponent artists={creators} />;
}
