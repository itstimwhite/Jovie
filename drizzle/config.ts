import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { Pool } from 'postgres';
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
    return drizzleNeon(sql);
  } else {
    // Use standard Postgres driver
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
    });
    return drizzle(pool);
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
export async function closeDb() {
  if (_db) {
    // If using postgres-js, we need to end the pool
    // This is a no-op for Neon serverless connections
    const pool = (_db as any)?.driver?.pool;
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
    _db = null;
  }
}
