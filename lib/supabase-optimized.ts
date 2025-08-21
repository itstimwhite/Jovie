import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cache the token fetching to avoid redundant calls
const getCachedToken = cache(async () => {
  try {
    const { getToken } = await auth();
    return await getToken();
  } catch {
    return null;
  }
});

// Optimized server client with connection pooling and caching
export async function createOptimizedServerClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are required');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'jovie-optimized',
      },
    },
    async accessToken() {
      return (await getCachedToken()) ?? null;
    },
  });
}

// Batch query helper for reducing database round trips
export async function batchQuery<T>(
  queries: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(queries.map((q) => q()));
}

// Query with automatic retry on transient failures
export async function queryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 2
): Promise<{ data: T | null; error: any }> {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    const result = await queryFn();

    if (!result.error) {
      return result;
    }

    // Only retry on transient errors
    if (
      result.error?.code === 'PGRST301' || // JWT expired
      result.error?.code === '503' || // Service unavailable
      result.error?.message?.includes('fetch')
    ) {
      lastError = result.error;
      if (i < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 100)
        );
        continue;
      }
    }

    return result;
  }

  return { data: null, error: lastError };
}
