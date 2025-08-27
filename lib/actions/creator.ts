'server only';

import { getCreatorProfileWithLinks } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function fetchCreatorProfile(username: string) {
  try {
    return await getCreatorProfileWithLinks(username);
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    throw new Error('Failed to fetch creator profile');
  }
}

export async function updateCreatorProfile(
  userId: string,
  updates: {
    displayName?: string;
    bio?: string;
    isPublic?: boolean;
    // Add other updatable fields as needed
  }
) {
  try {
    const updated = await updateCreatorProfile(userId, updates);
    revalidatePath('/dashboard/profile');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function createSocialLink(
  creatorProfileId: string,
  linkData: {
    platform: string;
    platformType: string;
    url: string;
    displayText?: string;
  }
) {
  try {
    const newLink = await createSocialLink(creatorProfileId, {
      ...linkData,
      isActive: true,
      sortOrder: 0, // You might want to calculate this
    });
    revalidatePath('/dashboard/links');
    return { success: true, data: newLink };
  } catch (error) {
    console.error('Error creating social link:', error);
    return { success: false, error: 'Failed to create social link' };
  }
}
