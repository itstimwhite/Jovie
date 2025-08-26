import type { Config } from 'drizzle-kit';
import { env } from './lib/env';

export default {
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL || '',
  },
  // Uncomment to use a custom schema
  // schema: 'public',
  verbose: true,
  strict: true,
} satisfies Config;
