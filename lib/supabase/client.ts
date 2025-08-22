import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { auth } from '@clerk/nextjs/server';

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
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || // New standard key
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Fallback to deprecated key

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration');
      }

      this.anonClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
        // Global settings for all queries
        global: {
          headers: {
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
        throw new Error('Missing Supabase service role configuration');
      }

      this.serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
        },
        // Global settings for all queries
        global: {
          headers: {
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

// Backward compatibility with existing code
/**
 * Create an anonymous Supabase client for public data
 * @returns Supabase client with anonymous access
 */
export function createAnonymousClient(): SupabaseClient {
  return getSupabaseAnonClient();
}

/**
 * Create an authenticated Supabase client with Clerk integration
 * @returns Supabase client with authentication
 */
export async function createAuthenticatedClient(): Promise<SupabaseClient> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        'x-connection-type': 'pooled-auth',
      },
    },
    auth: {
      persistSession: false,
    },
    // Add Clerk token for authentication
    async accessToken() {
      try {
        const { getToken } = auth();
        const token = await getToken();
        return token || null;
      } catch (error) {
        console.error('Error getting Clerk token:', error);
        return null;
      }
    },
  });
}

/**
 * Retry a Supabase query with exponential backoff
 * @param queryFn Function that executes the query
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @returns Query result
 */
export async function queryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>,
  maxRetries = 3,
  initialDelay = 300
): Promise<{ data: T | null; error: Error | null }> {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    const result = await queryFn();
    
    if (!result.error || result.error.message.includes('not found')) {
      return result;
    }
    
    retries++;
    if (retries >= maxRetries) {
      return result;
    }
    
    // Exponential backoff with jitter
    const jitter = Math.random() * 100;
    await new Promise(resolve => setTimeout(resolve, delay + jitter));
    delay *= 2;
  }
  
  return { data: null, error: new Error('Max retries exceeded') };
}

/**
 * Execute multiple Supabase queries in parallel with retry
 * @param queries Array of query functions
 * @returns Array of query results
 */
export async function batchQueries<T>(
  queries: Array<() => Promise<{ data: T | null; error: Error | null }>>
): Promise<Array<{ data: T | null; error: Error | null }>> {
  return Promise.all(queries.map(query => queryWithRetry(query)));
}

