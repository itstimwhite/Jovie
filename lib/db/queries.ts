import { eq } from 'drizzle-orm';
import { db } from './index';
import { creatorProfiles, socialLinks, users } from '../../drizzle/schema/index';

export async function getUserByClerkId(clerkId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return user || null;
}

export async function getCreatorProfileByUsername(username: string) {
  const [profile] = await db
    .select()
    .from(creatorProfiles)
    .where(eq(creatorProfiles.usernameNormalized, username.toLowerCase()))
    .limit(1);
  return profile || null;
}

export async function getCreatorProfileWithLinks(username: string) {
  // First get the profile
  const [profile] = await db
    .select()
    .from(creatorProfiles)
    .where(eq(creatorProfiles.usernameNormalized, username.toLowerCase()))
    .limit(1);

  if (!profile) return null;

  // Then get all social links for this profile
  const profileSocialLinks = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.creatorProfileId, profile.id))
    .orderBy(socialLinks.sortOrder);

  return {
    ...profile,
    socialLinks: profileSocialLinks,
  };
}

export async function updateCreatorProfile(
  clerkUserId: string,
  updates: Partial<typeof creatorProfiles.$inferInsert>
) {
  // First get the user ID from clerk_id
  const user = await getUserByClerkId(clerkUserId);
  if (!user) {
    throw new Error('User not found');
  }

  const [updated] = await db
    .update(creatorProfiles)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(creatorProfiles.userId, user.id))
    .returning();

  return updated || null;
}

export async function createSocialLink(
  creatorProfileId: string,
  linkData: typeof socialLinks.$inferInsert
) {
  const [newLink] = await db
    .insert(socialLinks)
    .values({
      ...linkData,
      creatorProfileId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newLink;
}

export async function deleteSocialLink(linkId: string) {
  const [deleted] = await db
    .delete(socialLinks)
    .where(eq(socialLinks.id, linkId))
    .returning();
  return deleted || null;
}
