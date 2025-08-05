import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single singleton instance
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Export the singleton instance
export const supabase = createBrowserClient();

// Function to get authenticated client (for use in components)
export async function getAuthenticatedClient() {
  try {
    // Import auth dynamically to avoid SSR issues
    const { auth } = await import('@clerk/nextjs');
    const { getToken } = auth();
    const token = await getToken({ template: 'supabase' });

    if (token) {
      // Update the existing client's headers with the token
      supabaseClient!.rest.headers = {
        ...supabaseClient!.rest.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      // Remove authorization header if no token
      const { Authorization, ...headers } = supabaseClient!.rest.headers;
      supabaseClient!.rest.headers = headers;
    }
  } catch (error) {
    console.error('Error getting Supabase token:', error);
    // Remove authorization header on error
    const { Authorization, ...headers } = supabaseClient!.rest.headers;
    supabaseClient!.rest.headers = headers;
  }

  return supabaseClient!;
}

// Hook for components that need authenticated access
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
