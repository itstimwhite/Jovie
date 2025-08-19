'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function completeOnboarding({
  username,
  displayName,
}: {
  username: string;
  displayName?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const supabase = createServerSupabase();

  try {
    // Step 1: Upsert app_users
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    await supabase.from('app_users').upsert({
      id: userId,
      email: userEmail ?? null,
    });

    // Step 2: Check if username is available
    const { data: existing } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (existing) {
      throw new Error('Username is already taken');
    }

    // Step 3: Check if user already has a creator profile
    const { data: userProfile } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (userProfile) {
      // User already has a profile, redirect to dashboard
      redirect('/dashboard');
    }

    // Step 4: Insert creator profile
    const { error } = await supabase.from('creator_profiles').insert({
      user_id: userId,
      creator_type: 'artist', // Default to artist for now
      username: username.toLowerCase(),
      display_name: displayName ?? username,
    });

    if (error) throw error;

    // Success - redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}
