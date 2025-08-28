'server only';

import { auth } from '@clerk/nextjs/server';
import { sql as drizzleSql } from 'drizzle-orm';
import { type DbType, db } from '@/lib/db';

/**
 * Validates that a user ID is safe to use in SQL queries
 * Clerk user IDs follow the pattern: user_[a-zA-Z0-9_]+
 */
function validateUserId(userId: string): void {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Clerk user IDs should start with "user_" and contain only safe characters
  const clerkUserIdPattern = /^user_[a-zA-Z0-9_]+$/;
  if (!clerkUserIdPattern.test(userId)) {
    throw new Error('Invalid user ID format');
  }

  // Additional length check for safety
  if (userId.length > 50) {
    throw new Error('User ID too long');
  }
}

/**
 * Sets up the database session for the authenticated user
 * This enables RLS policies to work properly with Clerk user ID
 */
export async function setupDbSession() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate user ID format for security
  validateUserId(userId);

  // Set the session variable for RLS using parameterized query
  // Use SQL template literal with proper parameter binding
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
 * Run DB operations inside a transaction with RLS session set.
 * Ensures SET LOCAL app.clerk_user_id is applied within the transaction scope.
 */
export async function withDbSessionTx<T>(
  operation: (tx: DbType, userId: string) => Promise<T>
): Promise<T> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate user ID format for security
  validateUserId(userId);

  return await db.transaction(async tx => {
    // Important: SET LOCAL must be inside the transaction to take effect
    // Use SQL template literal with proper parameter binding
    await tx.execute(drizzleSql`SET LOCAL app.clerk_user_id = ${userId}`);
    return await operation(tx as unknown as DbType, userId);
  });
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
