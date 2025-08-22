/**
 * Username availability checking with proper data isolation
 * This module provides secure username checking without exposing profile data
 */

import 'server-only';
import {
  createAuthenticatedClient,
  createAnonymousClient,
  queryWithRetry,
} from '@/lib/supabase/client';
import { validateUsername, normalizeUsername } from '@/lib/validation/username';

export interface UsernameAvailabilityResult {
  available: boolean;
  error?: string;
  validationError?: string;
}

/**
 * Check if a username is available for registration
 * This function only checks existence, doesn't return any profile data
 *
 * @param username - The username to check
 * @returns Availability result with error details if applicable
 */
export async function checkUsernameAvailability(
  username: string
): Promise<UsernameAvailabilityResult> {
  try {
    // First validate the username format
    const validation = validateUsername(username);
    if (!validation.isValid) {
      return {
        available: false,
        validationError: validation.error,
      };
    }

    // Normalize username for consistent checking
    const normalizedUsername = normalizeUsername(username);

    // Use anonymous client for username checking - this is public data
    // and doesn't require authentication, works with RLS policies
    const supabase = createAnonymousClient();

    // Query only for existence - don't return any profile data
    // Use case-insensitive lookup to match the unique constraint
    const { data, error } = await queryWithRetry(
      async () =>
        await supabase
          .from('creator_profiles')
          .select('username') // Only select username to minimize data exposure
          .eq('username', normalizedUsername) // Use normalized (lowercase) username
          .limit(1)
          .maybeSingle()
    );

    if (error) {
      console.error('Database error checking username:', error);
      return {
        available: false,
        error: 'Unable to check username availability. Please try again.',
      };
    }

    // Username is available if no record found
    const available = !data;

    return {
      available,
      error: available ? undefined : 'Username is already taken',
    };
  } catch (error) {
    console.error('Unexpected error checking username availability:', error);
    return {
      available: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Check if current user already has a profile
 * Used to prevent duplicate profile creation
 *
 * @param userId - Clerk user ID
 * @returns True if user already has a profile
 */
export async function checkUserHasProfile(userId: string): Promise<boolean> {
  try {
    // Try authenticated client first
    const supabase = await createAuthenticatedClient();

    const { data, error } = await queryWithRetry(
      async () =>
        await supabase
          .from('creator_profiles')
          .select('id') // Only select id to check existence
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle()
    );

    if (error) {
      console.error('Error checking user profile:', error);
      // If JWT signature error, fall back to assuming no profile exists
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        if (errorMessage.includes('JWSInvalidSignature')) {
          console.warn(
            'JWT signature invalid - assuming no profile exists to allow creation'
          );
          return false;
        }
      }
      return false; // Assume no profile on error to allow creation attempt
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking user profile:', error);
    return false;
  }
}
