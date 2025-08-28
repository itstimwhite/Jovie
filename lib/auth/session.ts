'server only';

import { auth } from '@clerk/nextjs/server';
import { sql as drizzleSql } from 'drizzle-orm';
import { type DB, db } from '@/lib/db';

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
  // Note: We can't use parameters for SET LOCAL, so we'll use raw SQL
  await db.execute(drizzleSql.raw(`SET LOCAL app.clerk_user_id = '${userId}'`));

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
  operation: (tx: DB, userId: string) => Promise<T>
): Promise<T> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return await db.transaction(async tx => {
    // Important: SET LOCAL must be inside the transaction to take effect
    await tx.execute(
      drizzleSql.raw(`SET LOCAL app.clerk_user_id = '${userId}'`)
    );
    return await operation(tx as unknown as DB, userId);
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
