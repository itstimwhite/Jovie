'use server';

import { auth } from '@clerk/nextjs/server';
import { updateCreatorProfile } from '@/lib/db/queries';

export async function updateThemePreference(theme: 'light' | 'dark' | 'system') {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const updatedProfile = await updateCreatorProfile(userId, { theme });
    
    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    return { success: true, theme };
  } catch (error) {
    console.error('Error updating theme preference:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update theme preference' 
    };
  }
}