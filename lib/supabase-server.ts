import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side function to get anonymous Supabase client
export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set');
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side function to get authenticated Supabase client using native integration
export async function createAuthenticatedServerClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables are not set');
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      async accessToken() {
        // For server-side, we need to get the token from the session
        const { getToken } = await auth();
        return (await getToken()) ?? null;
      },
    });
  } catch (error) {
    console.error('Error getting server Supabase client:', error);
  }

  // Fall back to anonymous client
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Alias for backward compatibility
export async function getAuthenticatedServerClient() {
  return createAuthenticatedServerClient();
}

// Helper function to get user ID from Clerk session
export async function getClerkUserId() {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Error getting Clerk user ID:', error);
    return null;
  }
}
