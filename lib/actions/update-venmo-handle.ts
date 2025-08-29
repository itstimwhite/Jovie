'use server';

import { withDbSession } from '@/lib/auth/session';
import { updateCreatorProfile } from '@/lib/db/queries';
import { validateVenmoHandle } from '@/lib/validation/venmo';

/**
 * Server action to update a user's Venmo handle
 * 
 * @param venmoHandle The new Venmo handle to save
 * @returns The updated profile or null if the update failed
 */
export async function updateVenmoHandle(venmoHandle: string) {
  try {
    return await withDbSession(async userId => {
      // Validate the Venmo handle
      const validation = validateVenmoHandle(venmoHandle);
      
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid Venmo handle');
      }
      
      // Update the profile with the normalized handle
      const updatedProfile = await updateCreatorProfile(userId, {
        venmoHandle: validation.normalizedHandle,
      });
      
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }
      
      return updatedProfile;
    });
  } catch (error) {
    console.error('Error updating Venmo handle:', error);
    throw error;
  }
}

