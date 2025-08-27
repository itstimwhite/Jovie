'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { withDbSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { creatorProfiles, users } from '@/lib/db/schema';
import {
  createOnboardingError,
  mapDatabaseError,
  OnboardingErrorCode,
} from '@/lib/errors/onboarding';
import {
  checkUserHasProfile,
  checkUsernameAvailability,
} from '@/lib/username/availability';
import { normalizeUsername, validateUsername } from '@/lib/validation/username';

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
    // TODO: Implement rate limiting with Drizzle/Upstash instead of RPC
    // For now, we'll skip rate limiting since we're migrating away from Supabase RPC
    // const headersList = await headers();
    // const forwarded = headersList.get('x-forwarded-for');
    // const clientIP = forwarded ? forwarded.split(',')[0] : null;

    // Skip rate limiting for now during migration
    console.log(
      'Rate limiting temporarily disabled during Supabase to Drizzle migration'
    );

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

    // Step 8: Create records using Drizzle transaction
    await withDbSession(async clerkUserId => {
      try {
        await db.transaction(async tx => {
          // First create user record
          await tx
            .insert(users)
            .values({
              clerkId: clerkUserId,
              email: userEmail ?? null,
            })
            .onConflictDoUpdate({
              target: users.clerkId,
              set: {
                email: userEmail ?? null,
                updatedAt: new Date(),
              },
            });

          // Get the user ID
          const [user] = await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.clerkId, clerkUserId))
            .limit(1);

          if (!user) {
            throw new Error('Failed to create or retrieve user');
          }

          // Then create creator profile
          await tx.insert(creatorProfiles).values({
            userId: user.id,
            creatorType: 'artist',
            username: normalizedUsername,
            usernameNormalized: normalizedUsername.toLowerCase(),
            displayName: displayName?.trim() || normalizedUsername,
            isPublic: true,
            onboardingCompletedAt: new Date(),
          });
        });
      } catch (error) {
        console.error('Error creating user and profile:', error);
        const mappedError = mapDatabaseError(error);
        throw new Error(mappedError.message);
      }
    });

    // Success - redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('🔴 ONBOARDING ERROR:', error);
    console.error(
      '🔴 ERROR STACK:',
      error instanceof Error ? error.stack : 'No stack available'
    );
    throw error;
  }
}
