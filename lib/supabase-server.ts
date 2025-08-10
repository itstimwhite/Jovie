import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Prevent multiple auth instances
    },
    async accessToken() {
      try {
        const { getToken } = await auth();
        // Use Clerk template for Supabase to obtain a Supabase-compatible JWT
        return (await getToken({ template: 'supabase' })) ?? null;
      } catch {
        return null;
      }
    },
  });
}

// Server-side function to get authenticated Supabase client using native integration
export async function createAuthenticatedServerClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      async accessToken() {
        // For server-side, we need to get the token from the session
        try {
          const { getToken } = await auth();
          // Use Clerk template for Supabase to obtain a Supabase-compatible JWT
          return (await getToken({ template: 'supabase' })) ?? null;
        } catch {
          return null;
        }
      },
    });
  } catch {
    // Fall back to anonymous client
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
    });
  }
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
  } catch {
    return null;
  }
}
