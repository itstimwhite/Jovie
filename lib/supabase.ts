import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublicKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single singleton instance for unauthenticated requests
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (!supabaseUrl || !supabasePublicKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabasePublicKey, {
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
    if (!supabaseUrl || !supabasePublicKey) {
      return null;
    }

    // Use native Supabase integration with accessToken in the global config
    return createClient(supabaseUrl, supabasePublicKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      accessToken: async () => {
        return session?.getToken() ?? null;
      },
    });
  };

  return { getAuthenticatedClient, supabase };
}

// Function to create authenticated client with session - uses native integration
export function createClerkSupabaseClient(
  session: ReturnType<typeof useSession>['session']
) {
  if (!supabaseUrl || !supabasePublicKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublicKey, {
    auth: {
      persistSession: false, // Prevent multiple auth instances
    },
    accessToken: async () => {
      return session?.getToken() ?? null;
    },
  });
}

// Legacy function for backward compatibility (deprecated)
export async function getAuthenticatedClient(token?: string | null) {
  try {
    if (!supabaseUrl || !supabasePublicKey) {
      return null;
    }

    if (token) {
      return createClient(supabaseUrl, supabasePublicKey, {
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
