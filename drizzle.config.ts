import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env';

const databaseUrl = env.DATABASE_URL || '';

// Clean the URL for Neon (remove the +neon part) — Drizzle Kit expects a standard Postgres URL
const url = databaseUrl.replace(/^postgres(ql)?\+neon:\/\//, 'postgres$1://');

export default defineConfig({
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
