'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { CreatorProfile } from '@/types/db';

export interface DashboardData {
  user: { id: string } | null;
  creatorProfiles: CreatorProfile[];
  selectedProfile: CreatorProfile | null;
  needsOnboarding: boolean;
}

export async function getDashboardData(): Promise<DashboardData> {
  const { userId } = await auth();

  if (!userId) {
    return {
      user: null,
      creatorProfiles: [],
      selectedProfile: null,
      needsOnboarding: true,
    };
  }

  const supabase = createServerSupabase();

  try {
    // Check if user exists in app_users table
    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

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

    // Get all creator profiles for this user
    const { data: creatorData, error } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: true }); // Oldest first as default

    if (error) {
      throw error;
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
