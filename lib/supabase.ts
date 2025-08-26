// Compatibility shim for tests that import '@/lib/supabase'
// Do NOT use in application code. Client-side Supabase is deprecated in this repo.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ClerkSessionForSupabaseCompat = {
  getToken: (options?: unknown) => Promise<string | null>;
};

export function createBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  } catch {
    return null;
  }
}

export function createClerkSupabaseClient(
  _session: ClerkSessionForSupabaseCompat
): SupabaseClient | null {
  // Mark parameter as used for linting purposes in this test-only shim
  void _session;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  // We don't wire token injection in tests; just return a basic client
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function useAuthenticatedSupabase(): {
  getAuthenticatedClient: () => SupabaseClient | null;
  supabase: SupabaseClient | null;
} {
  const client = createBrowserClient();
  return {
    getAuthenticatedClient: () => client,
    supabase: client,
  };
}

export const supabase: SupabaseClient | null = createBrowserClient();
