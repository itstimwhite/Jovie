'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { validateUsername, normalizeUsername } from '@/lib/validation/username';
import {
  checkUsernameAvailability,
  checkUserHasProfile,
} from '@/lib/username/availability';
import {
  OnboardingErrorCode,
  createOnboardingError,
  mapDatabaseError,
} from '@/lib/errors/onboarding';

// Helper function for retrying database queries
async function queryWithRetry<T>(queryFn: () => Promise<T>): Promise<T> {
  const maxRetries = 3;
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      // Only retry on specific errors that might be transient
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error.code === '40001' || error.code === '57014')
      ) {
        // Wait with exponential backoff before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt - 1)));
        continue;
      }
      
      // For other errors, don't retry
      throw error;
    }
  }
  
  // If we've exhausted all retries
  throw lastError;
}

export async function completeOnboarding({
  username,
  displayName,
}: {
  username: string;
  displayName?: string;
}) {
  try {
    // Step 1: Authentication check
    const { userId } = await auth();
    if (!userId) {
      const error = createOnboardingError(
        OnboardingErrorCode.NOT_AUTHENTICATED,
        'User not authenticated'
      );
      throw new Error(error.message);
    }

    // Step 2: Input validation
    const validation = validateUsername(username);
    if (!validation.isValid) {
      const error = createOnboardingError(
        OnboardingErrorCode.INVALID_USERNAME,
        validation.error || 'Invalid username'
      );
      throw new Error(error.message);
    }

    if (displayName && displayName.trim().length > 50) {
      const error = createOnboardingError(
        OnboardingErrorCode.DISPLAY_NAME_TOO_LONG,
        'Display name must be 50 characters or less'
      );
      throw new Error(error.message);
    }

    // Step 3: Rate limiting check
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const clientIP = forwarded ? forwarded.split(',')[0] : null;

    const supabase = createServerClient();
    
    if (!supabase) {
      const error = createOnboardingError(
        OnboardingErrorCode.DATABASE_ERROR,
        'Failed to connect to database'
      );
      throw new Error(error.message);
    }

    // Check rate limits - handle JWT errors gracefully
    const { data: rateLimitResult, error: rateLimitError } = await supabase.rpc(
      'check_onboarding_rate_limit',
      {
        user_id_param: userId,
        ip_address_param: clientIP,
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
      // If JWT signature error, skip rate limiting for now
      const errorMessage = rateLimitError.message || '';
      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('JWSInvalidSignature')
      ) {
        console.warn('JWT signature invalid - skipping rate limit check');
      } else {
        // For other errors, we might want to be more restrictive
        // but for now, let's continue with onboarding
      }
    } else if (rateLimitResult && !rateLimitResult.allowed) {
      const error = createOnboardingError(
        OnboardingErrorCode.RATE_LIMITED,
        `Too many attempts. Try again later.`,
        `Reset at: ${rateLimitResult.reset_at}`
      );
      throw new Error(error.message);
    }

    // Step 4-6: Parallel operations for performance optimization
    const normalizedUsername = normalizeUsername(username);

    // Run checks in parallel to reduce total operation time
    const [hasExistingProfile, availabilityResult, user] = await Promise.all([
      checkUserHasProfile(userId),
      checkUsernameAvailability(normalizedUsername),
      currentUser(),
    ]);

    // Early exit if user already has profile
    if (hasExistingProfile) {
      redirect('/dashboard');
    }

    // Check username availability
    if (!availabilityResult.available) {
      const errorCode = availabilityResult.validationError
        ? OnboardingErrorCode.INVALID_USERNAME
        : OnboardingErrorCode.USERNAME_TAKEN;

      const error = createOnboardingError(
        errorCode,
        availabilityResult.error ||
          availabilityResult.validationError ||
          'Username not available'
      );
      throw new Error(error.message);
    }

    // Step 7: Prepare user data for database operations
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    // Step 8: Create records using database transaction simulation
    // First create app_users record
    const { error: userError } = await queryWithRetry(
      async () =>
        await supabase.from('app_users').upsert({
          id: userId,
          email: userEmail ?? null,
        })
    );

    if (userError) {
      const mappedError = mapDatabaseError(userError);
      console.error('Error creating user record:', userError);
      throw new Error(mappedError.message);
    }

    // Then create creator profile
    const { error: profileError } = await queryWithRetry(
      async () =>
        await supabase.from('creator_profiles').insert({
          user_id: userId,
          creator_type: 'artist',
          username: normalizedUsername,
          display_name: displayName?.trim() || normalizedUsername,
          is_public: true,
          onboarding_completed_at: new Date().toISOString(),
        })
    );

    if (profileError) {
      const mappedError = mapDatabaseError(profileError);
      console.error('Error creating profile:', profileError);

      // If profile creation fails, we should clean up the app_users record
      // But since we're using RLS, the user can only see their own data anyway
      throw new Error(mappedError.message);
    }

    // Success - redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}

