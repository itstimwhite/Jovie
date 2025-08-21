'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Create service role client for onboarding operations (bypasses RLS)
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for onboarding operations'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function completeOnboarding({
  username,
  displayName,
}: {
  username: string;
  displayName?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const supabase = createServiceRoleClient();

  try {
    // Step 1: Upsert app_users
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    const { error: userError } = await supabase.from('app_users').upsert({
      id: userId,
      email: userEmail ?? null,
    });

    if (userError) {
      console.error('Error upserting user:', userError);
    }

    // Step 2: Check if username is available
    const { data: existing, error: checkError } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking username:', checkError);
      throw new Error('Error checking username availability');
    }

    if (existing) {
      throw new Error('Username is already taken');
    }

    // Step 3: Check if user already has a creator profile
    const { data: userProfile, error: profileError } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking user profile:', profileError);
    }

    if (userProfile) {
      // User already has a profile, redirect to dashboard
      redirect('/dashboard');
    }

    // Step 4: Insert creator profile
    const { error: insertError } = await supabase
      .from('creator_profiles')
      .insert({
        user_id: userId,
        creator_type: 'artist', // Default to artist for now
        username: username.toLowerCase(),
        display_name: displayName ?? username,
        is_public: true, // Make profile public by default
      });

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
