import { expect, test } from 'vitest';
import { sql } from 'drizzle-orm';

// This test verifies that the database connection is working
// and that we can execute a simple query
test('database connection', async () => {
  // Skip if we don't have a database connection
  if (!globalThis.db) {
    console.warn('Skipping database tests: No database connection');
    return;
  }

  try {
    // Simple query to verify the database is accessible
    const result = await db.execute(sql`SELECT 1 as test`);
    expect(result.rows[0]?.test).toBe(1);
  } catch (error) {
    console.error('Database test failed:', error);
    throw error;
  }
});
