import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Create the connection to Neon
const sql = neon(env.DATABASE_URL);

// Create the Drizzle instance with the Neon HTTP client
export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === 'development',
});

// Export types
export * from './schema';

export async function getDb() {
  return {
    db,
    // Add any database utility functions here
  };
}
