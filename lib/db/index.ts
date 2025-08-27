import { neon } from '@neondatabase/serverless';
import { sql as drizzleSql } from 'drizzle-orm';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';
import * as schema from './schema';

declare global {
  var db: NeonHttpDatabase<typeof schema> | undefined;
}

// Validate the database URL
const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the database connection
const sql = neon(databaseUrl);

// Create the database client with schema
type DbType = NeonHttpDatabase<typeof schema>;

// Use a single connection in development to avoid connection pool exhaustion
let db: DbType;

if (process.env.NODE_ENV === 'production') {
  db = drizzle(sql, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(sql, { schema });
  }
  db = global.db;
}

// Export the database instance
export { db };

export type { InferModel } from 'drizzle-orm';
// Re-export schema and types
export * from './schema';

/**
 * Helper to safely execute database operations with error handling
 */
export async function withDb<T>(
  operation: (db: DbType) => Promise<T>
): Promise<{ data?: T; error?: Error }> {
  try {
    const result = await operation(db);
    return { data: result };
  } catch (error) {
    console.error('Database operation failed:', error);
    return { error: error as Error };
  }
}

/**
 * Set session user ID for RLS policies
 */
export async function setSessionUser(userId: string) {
  try {
    await db.execute(drizzleSql`SET LOCAL app.clerk_user_id = ${userId}`);
  } catch (error) {
    console.error('Failed to set session user:', error);
    throw error;
  }
}

/**
 * Helper to get a database transaction
 */
export async function withTransaction<T>(
  operation: (tx: DbType) => Promise<T>
): Promise<{ data?: T; error?: Error }> {
  try {
    const result = await db.transaction(async () => {
      // The transaction callback receives a transaction client that we can pass to the operation
      return await operation(db);
    });
    return { data: result };
  } catch (error) {
    console.error('Transaction failed:', error);
    return { error: error as Error };
  }
}
