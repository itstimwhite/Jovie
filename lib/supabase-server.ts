import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side function to get anonymous Supabase client
export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set');
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side function to get authenticated Supabase client using new integration
export async function createAuthenticatedServerClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables are not set');
      throw new Error('Supabase environment variables are not configured');
    }

    // Get the JWT token from Clerk using the new integration
    const { getToken } = await auth();
    const token = await getToken();

    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error getting server Supabase token:', error);
  }

  // Fall back to anonymous client
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
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
