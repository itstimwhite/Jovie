import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton instance for anonymous access
let browserClient: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// Export the singleton instance for anonymous access
export const supabase = createBrowserClient();

// Hook to get authenticated Supabase client
export function useSupabase() {
  const { getToken } = useAuth();

  const getAuthenticatedClient = async () => {
    try {
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
      console.error('Error getting Supabase token:', error);
    }

    // Fall back to anonymous client
    return supabase;
  };

  return { getAuthenticatedClient, supabase };
}
