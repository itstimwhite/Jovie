import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single singleton instance for unauthenticated requests
let supabaseClient: ReturnType<typeof createClient> | null = null;
let authenticatedClient: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
    });
  }
  return supabaseClient;
}

// Export the singleton instance for unauthenticated requests
export const supabase = createBrowserClient();

// Hook to get authenticated client with native Clerk integration
export function useAuthenticatedSupabase() {
  const { session } = useSession();

  const getAuthenticatedClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    // Return the same authenticated client instance if session hasn't changed
    if (authenticatedClient) {
      return authenticatedClient;
    }

    authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      async accessToken() {
        return session?.getToken() ?? null;
      },
    });

    return authenticatedClient;
  };

  return { getAuthenticatedClient, supabase };
}

// Function to create authenticated client with session
export function createClerkSupabaseClient(
  session: ReturnType<typeof useSession>['session']
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Prevent multiple auth instances
    },
    async accessToken() {
      return session?.getToken() ?? null;
    },
  });
}

// Legacy function for backward compatibility (deprecated)
export async function getAuthenticatedClient(token?: string | null) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Prevent multiple auth instances
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
    return supabaseClient;
  } catch {
    return supabaseClient;
  }
}

// Legacy hook for backward compatibility (deprecated)
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
