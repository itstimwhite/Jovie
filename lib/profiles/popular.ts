import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { cache } from '@/lib/cache';

/**
 * Create an anonymous Supabase client for public data
 */
function createAnonSupabase() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || // New standard key
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Fallback to deprecated key

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get a list of popular profile usernames for pre-generation
 * This is used by generateStaticParams to pre-generate popular profiles
 * @returns Array of popular profile usernames
 */
export async function getPopularProfiles(): Promise<{ username: string }[]> {
  // Try to get from cache first
  const cachedUsernames = await cache.popularProfiles.get();
  if (cachedUsernames) {
    return cachedUsernames.map((username) => ({ username }));
  }

  // If not in cache, fetch from database
  try {
    const supabase = createAnonSupabase();

    // Query for popular profiles based on view count or other metrics
    // This is a simplified example - in production, you'd use actual metrics
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('username')
      .eq('is_public', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) {
      console.error('Error fetching popular profiles:', error);
      return [];
    }

    // Cache the results for future use
    const usernames = data.map((profile) => profile.username);
    await cache.popularProfiles.set(usernames);

    return data;
  } catch (error) {
    console.error('Error in getPopularProfiles:', error);
    return [];
  }
}

/**
 * Warm the cache for popular profiles
 * This can be called by a cron job or manually to pre-warm the cache
 */
export async function warmPopularProfilesCache(): Promise<void> {
  try {
    const popularProfiles = await getPopularProfiles();
    const supabase = createAnonSupabase();

    // Fetch full profile data for each popular profile
    for (const { username } of popularProfiles) {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('is_public', true)
        .single();

      if (error || !data) {
        console.error(`Error fetching profile for ${username}:`, error);
        continue;
      }

      // Cache the profile data
      await cache.profile.set(username, data);

      // Also fetch and cache social links
      const { data: socialLinks, error: socialLinksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('creator_profile_id', data.id);

      if (socialLinksError || !socialLinks) {
        console.error(
          `Error fetching social links for ${username}:`,
          socialLinksError
        );
        continue;
      }

      await cache.socialLinks.set(data.id, socialLinks);
    }

    console.log(`Warmed cache for ${popularProfiles.length} popular profiles`);
  } catch (error) {
    console.error('Error warming popular profiles cache:', error);
  }
}
