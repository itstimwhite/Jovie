import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

// This file sets up the test database connection and runs migrations

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in test environment');
}

// Create a connection to the test database
const sql = neon(databaseUrl);
const db = drizzle(sql);

// Run migrations before all tests
beforeAll(async () => {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }
});

// Clean up after all tests
afterAll(async () => {
  // Add any cleanup logic here if needed
  // For example, you might want to drop test data
});

export { db };
