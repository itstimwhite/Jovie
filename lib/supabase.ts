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
// This will be called from client components, so we need to get the token differently
export async function getAuthenticatedClient() {
  try {
    // For client-side usage, we'll use the base client
    // The authentication will be handled by the middleware and RLS policies
    return supabaseClient!;
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    return supabaseClient!;
  }
}

// Hook for components that need authenticated access
export function useSupabase() {
  return { getAuthenticatedClient, supabase };
}
