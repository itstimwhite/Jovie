import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';
import { env } from '../lib/env';

/**
 * Drizzle ORM database connection factory
 *
 * This module provides a unified interface for connecting to PostgreSQL databases
 * using Drizzle ORM, supporting both standard Postgres connections (via postgres-js)
 * and Neon serverless connections.
 *
 * The connection type is determined by the DATABASE_URL format:
 * - postgres:// or postgresql:// -> Standard Postgres connection
 * - postgres+neon:// or postgresql+neon:// -> Neon serverless connection
 */

// Connection singleton to avoid multiple connections in development
let _db: ReturnType<typeof createDrizzleClient> | null = null;

/**
 * Creates a Drizzle ORM client based on the DATABASE_URL format
 */
function createDrizzleClient() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Check if the URL is for Neon
  if (
    env.DATABASE_URL.startsWith('postgres+neon://') ||
    env.DATABASE_URL.startsWith('postgresql+neon://')
  ) {
    // Use Neon serverless driver
    const sql = neon(env.DATABASE_URL);
    return drizzleNeon(sql as any); // Type assertion to avoid TypeScript errors
  } else {
    // Use standard Postgres driver
    const client = postgres(env.DATABASE_URL, {
      max: 10,
    });
    return drizzle(client);
  }
}

/**
 * Gets a Drizzle ORM client instance
 * In development, reuses the same connection to avoid connection pool exhaustion
 */
export function getDb() {
  if (process.env.NODE_ENV === 'production') {
    // In production, create a new client for each request to ensure isolation
    return createDrizzleClient();
  }

  // In development, reuse the same client to avoid connection pool exhaustion
  if (!_db) {
    _db = createDrizzleClient();
  }
  return _db;
}

/**
 * Explicitly closes the database connection
 * Useful for tests and scripts that need to clean up connections
 */
// Type for Drizzle client with postgres-js
interface PostgresJsDrizzleClient {
  driver?: {
    client?: {
      end?: () => Promise<void>;
    };
  };
}

// Type guard to check if _db is a PostgresJsDrizzleClient
function isPostgresJsDrizzleClient(db: unknown): db is PostgresJsDrizzleClient {
  return (
    typeof db === 'object' &&
    db !== null &&
    'driver' in db &&
    typeof (db as any).driver === 'object' &&
    (db as any).driver !== null &&
    'client' in (db as any).driver &&
    typeof (db as any).driver.client === 'object'
  );
}

export async function closeDb() {
  if (_db) {
    // If using postgres-js, we need to end the pool
    // This is a no-op for Neon serverless connections
    if (isPostgresJsDrizzleClient(_db)) {
      const client = _db.driver?.client;
      if (client && typeof client.end === 'function') {
        await client.end();
      }
    }
    _db = null;
  }
}
