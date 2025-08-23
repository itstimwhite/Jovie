/**
 * Server-side Supabase client with Clerk integration
 * Anti-cloaking compliant database access
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Create server-side Supabase client with authentication
 * This is the main function used throughout the app
 */
export async function createServerClient() {
  try {
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    // Get Clerk auth context
    const { userId } = await auth();
    
    if (!userId) {
      // If not authenticated, return anonymous client
      return createClient(supabaseUrl, supabaseAnonKey);
    }
    
    // Create server component client with cookies
    const supabase = createServerComponentClient({ cookies });
    
    return supabase;
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    return null;
  }
}

/**
 * Synchronous version for cases where we need immediate client
 * Note: This won't have authentication context
 */
export function createServerClientSync() {
  try {
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    // Create anonymous client
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error creating sync Supabase client:', error);
    return null;
  }
}

/**
 * Create server-side Supabase client without authentication
 * For public data access
 */
export function createPublicSupabaseClient() {
  return createServerClientSync();
}

export type { SupabaseClient } from '@supabase/supabase-js';

