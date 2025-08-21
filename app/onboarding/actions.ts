'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  createOptimizedServerClient,
  queryWithRetry,
} from '@/lib/supabase-optimized';

export async function completeOnboarding({
  username,
  displayName,
}: {
  username: string;
  displayName?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const supabase = await createOptimizedServerClient();

  try {
    // Get user details
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    // Step 1: Check if username is available and if user has existing profile
    const [usernameCheck, profileCheck] = await Promise.all([
      queryWithRetry(
        async () =>
          await supabase
            .from('creator_profiles')
            .select('id')
            .eq('username', username.toLowerCase())
            .limit(1)
            .maybeSingle()
      ),
      queryWithRetry(
        async () =>
          await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', userId)
            .limit(1)
            .maybeSingle()
      ),
    ]);

    if (usernameCheck.error) {
      console.error('Error checking username:', usernameCheck.error);
      throw new Error('Error checking username availability');
    }

    if (usernameCheck.data) {
      throw new Error('Username is already taken');
    }

    if (profileCheck.data) {
      // User already has a profile, redirect to dashboard
      redirect('/dashboard');
    }

    // Step 2: Create user record and profile in a transaction-like manner
    // First ensure app_users record exists
    const { error: userError } = await queryWithRetry(
      async () =>
        await supabase.from('app_users').upsert({
          id: userId,
          email: userEmail ?? null,
        })
    );

    if (userError) {
      console.error('Error upserting user:', userError);
      throw new Error('Failed to create user record');
    }

    // Then create the creator profile
    const { error: insertError } = await queryWithRetry(
      async () =>
        await supabase.from('creator_profiles').insert({
          user_id: userId,
          creator_type: 'artist',
          username: username.toLowerCase(),
          display_name: displayName ?? username,
          is_public: true,
        })
    );

    if (insertError) {
      console.error('Error inserting profile:', insertError);
      throw new Error(`Profile creation failed: ${insertError.message}`);
    }

    // Success - redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}
