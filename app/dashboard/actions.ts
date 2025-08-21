'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import { CreatorProfile } from '@/types/db';
import { unstable_noStore as noStore } from 'next/cache';

export interface DashboardData {
  user: { id: string } | null;
  creatorProfiles: CreatorProfile[];
  selectedProfile: CreatorProfile | null;
  needsOnboarding: boolean;
}

export async function getDashboardData(): Promise<DashboardData> {
  // Prevent caching of user-specific data
  noStore();

  const { userId } = await auth();

  if (!userId) {
    return {
      user: null,
      creatorProfiles: [],
      selectedProfile: null,
      needsOnboarding: true,
    };
  }

  const supabase = createServerClient();
  if (!supabase) {
    throw new Error('Failed to create Supabase client');
  }

  try {
    // Parallelize user and creator profile queries
    const [userResult, creatorResult] = await Promise.all([
      // Check if user exists in app_users table
      supabase.from('app_users').select('id').eq('id', userId).maybeSingle(),
      // Get creator profiles (will fail gracefully if user doesn't exist)
      supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
    ]);

    const { data: userData, error: userError } = userResult;
    const { data: creatorData, error: creatorError } = creatorResult;

    if (userError) {
      // If it's a permission error, the user likely needs to be created
      if (userError.code === 'PGRST301' || userError.code === '42501') {
        return {
          user: null,
          creatorProfiles: [],
          selectedProfile: null,
          needsOnboarding: true,
        };
      }
      throw userError;
    }

    if (!userData?.id) {
      // No user row yet → send to onboarding to create user/artist
      return {
        user: null,
        creatorProfiles: [],
        selectedProfile: null,
        needsOnboarding: true,
      };
    }

    // Handle creator profile query errors
    if (creatorError) {
      // If it's a permission error, treat as no profiles
      if (creatorError.code === 'PGRST301' || creatorError.code === '42501') {
        return {
          user: userData,
          creatorProfiles: [],
          selectedProfile: null,
          needsOnboarding: true,
        };
      }
      throw creatorError;
    }

    if (!creatorData || creatorData.length === 0) {
      // No creator profiles yet → onboarding
      return {
        user: userData,
        creatorProfiles: [],
        selectedProfile: null,
        needsOnboarding: true,
      };
    }

    // Return data with first profile selected by default
    return {
      user: userData,
      creatorProfiles: creatorData,
      selectedProfile: creatorData[0],
      needsOnboarding: false,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function updateCreatorProfile(
  profileId: string,
  updates: Partial<{
    marketing_opt_out: boolean;
    display_name: string;
    bio: string;
    avatar_url: string;
    // Add other updatable fields as needed
  }>
): Promise<CreatorProfile> {
  // Prevent caching of mutations
  noStore();

  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createServerClient();
  if (!supabase) {
    throw new Error('Failed to create Supabase client');
  }

  try {
    // Update the creator profile
    const { data, error } = await supabase
      .from('creator_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .eq('user_id', userId) // Ensure user can only update their own profile
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Profile not found or not updated');
    }

    return data as CreatorProfile;
  } catch (error) {
    console.error('Error updating creator profile:', error);
    throw error;
  }
}
