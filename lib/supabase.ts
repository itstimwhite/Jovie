import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single singleton instance for unauthenticated requests
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
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
      console.warn('Supabase environment variables are not set');
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    });
  };

  return { getAuthenticatedClient, supabase };
}

// Function to create authenticated client with session
export function createClerkSupabaseClient(
  session: ReturnType<typeof useSession>['session']
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set');
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return session?.getToken() ?? null;
    },
  });
}

// Legacy function for backward compatibility (deprecated)
export async function getAuthenticatedClient(token?: string | null) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables are not set');
      return null;
    }

    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
    return supabaseClient;
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    return supabaseClient;
  }
}

// Legacy hook for backward compatibility (deprecated)
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
