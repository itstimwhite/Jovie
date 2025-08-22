/**
 * Server-side Supabase client with Clerk integration
 * Anti-cloaking compliant database access
 */

import { createAuthenticatedClient, createAnonymousClient } from './client';

/**
 * Create server-side Supabase client with authentication
 * This is the main function used throughout the app
 */
export async function createServerSupabaseClient() {
  return await createAuthenticatedClient();
}

/**
 * Synchronous version for cases where we need immediate client
 * Note: This won't have authentication context
 */
export function createServerSupabaseClientSync() {
  return createAnonymousClient();
}

/**
 * Create server-side Supabase client without authentication
 * For public data access
 */
export function createPublicSupabaseClient() {
  return createAnonymousClient();
}

// Re-export for convenience
export { queryWithRetry, batchQueries } from './client';
export type { SupabaseClient } from '@supabase/supabase-js';
