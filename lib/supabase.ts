import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single singleton instance
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

// Export the singleton instance
export const supabase = createBrowserClient();

// Hook to get authenticated client with Clerk integration
export function useAuthenticatedSupabase() {
  const { getToken } = useAuth();

  const getAuthenticatedClient = async () => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables are not set');
        return null;
      }

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
      console.error('Error getting authenticated Supabase client:', error);
    }

    // Fall back to base client
    return supabaseClient;
  };

  return { getAuthenticatedClient, supabase };
}

// Legacy function for backward compatibility
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

// Legacy hook for backward compatibility
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
