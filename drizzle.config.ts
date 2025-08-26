import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env';

export default defineConfig({
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
