/**
 * Consolidated Supabase client creation utilities
 * This module provides the single source of truth for all Supabase client creation
 */

import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

/**
 * Get Supabase configuration at runtime
 * This avoids issues with environment variables during build time
 */
function getSupabaseConfig() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
 * Cache the Clerk token fetching to avoid redundant auth calls
 * This significantly improves performance for multiple Supabase queries
 */
const getCachedClerkToken = cache(async () => {
  try {
    const { getToken } = await auth();
    return await getToken();
  } catch (error) {
    console.error('Error fetching Clerk token:', error);
    return null;
  }
});

/**
 * Standard configuration for all Supabase clients with connection pooling
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
      'x-connection-type': 'pooled',
    },
  },
};

/**
 * Singleton class for Supabase client with connection pooling
 * This ensures we reuse the same connection across requests
 */
class SupabaseClientManager {
  private static instance: SupabaseClientManager;
  private anonClient: SupabaseClient | null = null;
  private serviceClient: SupabaseClient | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of SupabaseClientManager
   */
  public static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager();
    }
    return SupabaseClientManager.instance;
  }

  /**
   * Get the anonymous Supabase client for public data
   * This client uses the public anon key and is suitable for unauthenticated requests
   */
  public getAnonClient(): SupabaseClient {
    if (!this.anonClient) {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

      this.anonClient = createClient(supabaseUrl, supabaseAnonKey, {
        ...baseConfig,
        global: {
          ...baseConfig.global,
          headers: {
            ...baseConfig.global.headers,
            'x-connection-type': 'pooled-anon',
          },
        },
      });
    }

    return this.anonClient;
  }

  /**
   * Get the service role Supabase client for admin operations
   * This client uses the service role key and bypasses RLS
   * IMPORTANT: Only use this for server-side operations that require admin privileges
   */
  public getServiceClient(): SupabaseClient {
    if (!this.serviceClient) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
          'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please configure it in your .env.local file or deployment environment.'
        );
      }

      this.serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        ...baseConfig,
        global: {
          ...baseConfig.global,
          headers: {
            ...baseConfig.global.headers,
            'x-connection-type': 'pooled-service',
          },
        },
      });
    }

    return this.serviceClient;
  }

  /**
   * Reset the clients (useful for testing)
   */
  public resetClients(): void {
    this.anonClient = null;
    this.serviceClient = null;
  }
}

// Export singleton instance methods
export const getSupabaseAnonClient = () => SupabaseClientManager.getInstance().getAnonClient();
export const getSupabaseServiceClient = () => SupabaseClientManager.getInstance().getServiceClient();

// For testing purposes
export const resetSupabaseClients = () => SupabaseClientManager.getInstance().resetClients();

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
    global: {
      ...baseConfig.global,
      headers: {
        ...baseConfig.global.headers,
        'x-connection-type': 'pooled-auth',
      },
    },
    async accessToken() {
      return (await getCachedClerkToken()) ?? null;
    },
  });
}

/**
 * Create an anonymous Supabase client for public data access
 * Used for operations that don't require authentication
 *
 * @returns Supabase client without authentication
 */
export function createAnonymousClient(): SupabaseClient {
  return getSupabaseAnonClient();
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

