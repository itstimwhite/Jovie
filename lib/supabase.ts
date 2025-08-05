import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single singleton instance
let supabaseClient: ReturnType<typeof createClient> | null = null;
let authenticatedClient: ReturnType<typeof createClient> | null = null;

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
    const { auth } = await import('@clerk/nextjs/server');
    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' });

    if (token) {
      // Create a new authenticated client if we don't have one
      if (!authenticatedClient) {
        authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } else {
        // Create a new client with updated headers
        authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      }
      
      return authenticatedClient;
    }
  } catch (error) {
    console.error('Error getting Supabase token:', error);
  }

  // Fall back to anonymous client
  return supabaseClient!;
}

// Hook for components that need authenticated access
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
