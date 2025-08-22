/**
 * Optimized Supabase queries with connection pooling and caching
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { queryCache, CACHE_TTL } from '@/lib/cache';

// Connection pool configuration
const connectionConfig = {
  db: {
    // Connection pooling settings
    poolSize: 10,
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000,
  },
  auth: {
    autoRefreshToken: false, // Disable for public queries
    persistSession: false,
  },
  realtime: {
    disabled: true, // Disable for static data
  },
};

/**
 * Create optimized Supabase client with connection pooling
 */
function createOptimizedSupabase() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = 
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey, connectionConfig);
}

/**
 * Cached query for popular profiles
 */
export async function getPopularProfiles(limit: number = 10) {
  const cacheKey = `popular-profiles:${limit}`;
  
  // Check cache first
  const cached = await queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const supabase = createOptimizedSupabase();
  
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('username, display_name, avatar_url, is_verified, is_featured')
    .eq('is_public', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Popular profiles query error:', error);
    return [];
  }

  // Cache the result
  await queryCache.set(cacheKey, data, CACHE_TTL.POPULAR_PROFILES);
  
  return data || [];
}

/**
 * Optimized profile query with prepared statement pattern
 */
export async function getProfileOptimized(username: string) {
  const supabase = createOptimizedSupabase();
  
  // Use single query instead of N+1 queries
  const { data, error } = await supabase
    .from('creator_profiles')
    .select(`
      id,
      user_id,
      creator_type,
      username,
      display_name,
      bio,
      avatar_url,
      spotify_url,
      apple_music_url,
      youtube_url,
      spotify_id,
      is_public,
      is_verified,
      is_claimed,
      is_featured,
      theme,
      created_at,
      updated_at
    `)
    .eq('username', username.toLowerCase())
    .eq('is_public', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Batch query for multiple profiles (more efficient than individual queries)
 */
export async function getProfilesBatch(usernames: string[]) {
  const supabase = createOptimizedSupabase();
  
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('username, display_name, avatar_url, is_verified')
    .in('username', usernames.map(u => u.toLowerCase()))
    .eq('is_public', true);

  if (error) {
    console.error('Batch profiles query error:', error);
    return [];
  }

  return data || [];
}

/**
 * Materialized view query for analytics (when available)
 */
export async function getProfileAnalytics(username: string) {
  const cacheKey = `analytics:${username}`;
  
  // Check cache first
  const cached = await queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const supabase = createOptimizedSupabase();
  
  // This would use a materialized view in production
  const { data, error } = await supabase
    .rpc('get_profile_analytics', { profile_username: username });

  if (error) {
    console.warn('Analytics query error:', error);
    return null;
  }

  // Cache analytics data
  await queryCache.set(cacheKey, data, CACHE_TTL.API_ROUTES);
  
  return data;
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth() {
  try {
    const supabase = createOptimizedSupabase();
    
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('count')
      .limit(1);

    return { healthy: !error, error: error?.message };
  } catch (error) {
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}