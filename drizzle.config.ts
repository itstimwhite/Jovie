import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env';

const databaseUrl = env.DATABASE_URL || '';

// Determine the appropriate driver based on the DATABASE_URL format
const driver = databaseUrl.startsWith('postgres+neon://') || databaseUrl.startsWith('postgresql+neon://') ? 'neon-http' : 'pg';

// Clean the URL for Neon (remove the +neon part)
const connectionString = databaseUrl.replace(/^postgres(ql)?\+neon:\/\//, 'postgres$1://');

export default defineConfig({
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  driver,
  dbCredentials: {
    connectionString,
  },
  verbose: true,
  strict: true,
});
