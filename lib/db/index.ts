import { neon } from '@neondatabase/serverless';
import { sql as drizzleSql } from 'drizzle-orm';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';
import * as schema from './schema';

declare global {
  var db: NeonHttpDatabase<typeof schema> | undefined;
}

// Create the database client with schema
type DbType = NeonHttpDatabase<typeof schema>;

// Lazy initialization of database connection
let _db: DbType | undefined;

function initializeDb(): DbType {
  // Validate the database URL at runtime
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'This is required for database operations but can be omitted during build time.'
    );
  }

  // Create the database connection
  const sql = neon(databaseUrl);

  // Use a single connection in development to avoid connection pool exhaustion
  if (process.env.NODE_ENV === 'production') {
    return drizzle(sql, { schema });
  } else {
    if (!global.db) {
      global.db = drizzle(sql, { schema });
    }
    return global.db;
  }
}

// Export a getter function that initializes the connection on first access
export const db = new Proxy({} as DbType, {
  get(target, prop) {
    if (!_db) {
      _db = initializeDb();
    }
    return Reflect.get(_db, prop);
  },
});

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
    // Ensure db is initialized before passing to operation
    if (!_db) {
      _db = initializeDb();
    }
    const result = await operation(_db);
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
    // Ensure db is initialized before using
    if (!_db) {
      _db = initializeDb();
    }
    await _db.execute(drizzleSql`SET LOCAL app.clerk_user_id = ${userId}`);
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
    // Ensure db is initialized before using
    if (!_db) {
      _db = initializeDb();
    }
    const result = await _db.transaction(async () => {
      // The transaction callback receives a transaction client that we can pass to the operation
      return await operation(_db!);
    });
    return { data: result };
  } catch (error) {
    console.error('Transaction failed:', error);
    return { error: error as Error };
  }
}
