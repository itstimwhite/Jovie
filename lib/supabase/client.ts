'use client';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

export function useClerkSupabase() {
  const { session } = useSession();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const client = createClient(supabaseUrl, supabaseKey, {
    accessToken: async () => (await session?.getToken()) ?? null,
  });

  return client;
}
