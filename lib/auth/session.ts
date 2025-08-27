'server only';

import { auth } from '@clerk/nextjs/server';
import { sql as drizzleSql } from 'drizzle-orm';
import { db } from '@/lib/db';

/**
 * Sets up the database session for the authenticated user
 * This enables RLS policies to work properly with Clerk user ID
 */
export async function setupDbSession() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Set the session variable for RLS
  await db.execute(drizzleSql`SET LOCAL app.clerk_user_id = ${userId}`);

  return { userId };
}

/**
 * Wrapper function to run database operations with proper session setup
 */
export async function withDbSession<T>(
  operation: (userId: string) => Promise<T>
): Promise<T> {
  const { userId } = await setupDbSession();
  return await operation(userId);
}

/**
 * Get the current user ID or throw if not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
}
