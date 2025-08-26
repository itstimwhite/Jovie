import type { Config } from 'drizzle-kit';
import { env } from './lib/env';

export default {
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  driver: 'pg' as const,
  dbCredentials: {
    connectionString: env.DATABASE_URL || '',
  } as any, // Type assertion to avoid TypeScript errors
  verbose: true,
  strict: true,
} satisfies Config;
