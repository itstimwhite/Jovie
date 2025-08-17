import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublicKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single singleton instance for unauthenticated requests
let supabaseClient: ReturnType<typeof createClient> | null = null;
let authenticatedClient: ReturnType<typeof createClient> | null = null;

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

    // Return the same authenticated client instance if session hasn't changed
    if (authenticatedClient) {
      return authenticatedClient;
    }

    // Inject Clerk JWT per request using a custom fetch so RLS is satisfied
    const authFetch: typeof fetch = async (input, init) => {
      const token = await session?.getToken({ template: 'supabase' });
      const headers = new Headers(init?.headers || {});
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    };

    authenticatedClient = createClient(supabaseUrl, supabasePublicKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      global: {
        fetch: authFetch,
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
  if (!supabaseUrl || !supabasePublicKey) {
    return null;
  }

  const authFetch: typeof fetch = async (input, init) => {
    let token: string | null | undefined;
    try {
      token = await session?.getToken({ template: 'supabase' });
    } catch (error) {
      // Optionally log the error, or handle as needed
      token = null;
    }
    const headers = new Headers(init?.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  return createClient(supabaseUrl, supabasePublicKey, {
    auth: {
      persistSession: false, // Prevent multiple auth instances
    },
    global: {
      fetch: authFetch,
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
