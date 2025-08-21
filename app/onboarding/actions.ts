'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  createAuthenticatedClient,
  queryWithRetry,
} from '@/lib/supabase/client';
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

    const supabase = await createAuthenticatedClient();

    // Check rate limits
    const { data: rateLimitResult, error: rateLimitError } = await supabase.rpc(
      'check_onboarding_rate_limit',
      {
        user_id_param: userId,
        ip_address_param: clientIP,
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
    } else if (rateLimitResult && !rateLimitResult.allowed) {
      const error = createOnboardingError(
        OnboardingErrorCode.RATE_LIMITED,
        `Too many attempts. Try again later.`,
        `Reset at: ${rateLimitResult.reset_at}`
      );
      throw new Error(error.message);
    }

    // Step 4: Check if user already has profile
    const hasExistingProfile = await checkUserHasProfile(userId);
    if (hasExistingProfile) {
      redirect('/dashboard');
    }

    // Step 5: Check username availability
    const normalizedUsername = normalizeUsername(username);
    const availabilityResult =
      await checkUsernameAvailability(normalizedUsername);

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

    // Step 6: Get user details for profile creation
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    // Step 7: Create records using database transaction simulation
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
