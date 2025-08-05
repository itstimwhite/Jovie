import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side function to get anonymous Supabase client
export async function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side function to get authenticated Supabase client
export async function createAuthenticatedServerClient() {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' });

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
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Alias for backward compatibility
export async function getAuthenticatedServerClient() {
  return createAuthenticatedServerClient();
}
