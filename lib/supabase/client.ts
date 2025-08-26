/**
 * Consolidated Supabase client creation utilities
 * This module provides the single source of truth for all Supabase client creation
 */

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

/**
 * Get Supabase configuration at runtime
 * This avoids issues with environment variables during build time
 */
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please configure it in your .env.local file or deployment environment.'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Missing Supabase anonymous key. Please set either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file or deployment environment.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Cache the Clerk token fetching to avoid redundant auth calls.
 * Uses a module-scoped Promise for compatibility in test environments.
 */
let cachedTokenPromise: Promise<string | null> | null = null;
async function getClerkTokenCached(): Promise<string | null> {
  if (!cachedTokenPromise) {
    cachedTokenPromise = (async () => {
      try {
        const { getToken } = await auth();
        return await getToken();
      } catch (error) {
        console.error('Error fetching Clerk token:', error);
        return null;
      }
    })();
  }
  return cachedTokenPromise;
}

/**
 * Standard configuration for all Supabase clients
 */
const baseConfig = {
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
      'x-client-info': 'jovie-server',
    },
  },
};

/**
 * Create an authenticated Supabase client for server-side operations
 * Uses Clerk's native integration with cached token fetching
 *
 * @returns Supabase client with Clerk authentication
 */
export async function createAuthenticatedClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey, {
    ...baseConfig,
    async accessToken() {
      return (await getClerkTokenCached()) ?? null;
    },
  });
}

/**
 * Create an anonymous Supabase client for public data access
 * Used for operations that don't require authentication
 *
 * @returns Supabase client without authentication
 */
export function createAnonymousClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey, baseConfig);
}

/**
 * Query retry utility with exponential backoff
 * Handles transient failures like JWT expiry or network issues
 *
 * @param queryFn - The query function to execute
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Query result with data or error
 */
export async function queryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  maxRetries = 2
): Promise<{ data: T | null; error: unknown }> {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    const result = await queryFn();

    if (!result.error) {
      return result;
    }

    // Only retry on transient errors
    const errorRecord = result.error as Record<string, unknown>;
    const isTransientError =
      errorRecord?.code === 'PGRST301' || // JWT expired
      errorRecord?.code === '503' || // Service unavailable
      (errorRecord?.message as string)?.includes('fetch') || // Network error
      (errorRecord?.message as string)?.includes('ECONNREFUSED'); // Connection refused

    if (isTransientError && i < maxRetries) {
      lastError = result.error;
      // Exponential backoff: 100ms, 200ms, 400ms...
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 100));
      continue;
    }

    return result;
  }

  return { data: null, error: lastError };
}

/**
 * Execute multiple queries in parallel for better performance
 *
 * @param queries - Array of query functions to execute
 * @returns Array of query results
 */
export async function batchQueries<T>(
  queries: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(queries.map((q) => q()));
}

// Re-export types for convenience
export type { SupabaseClient } from '@supabase/supabase-js';
