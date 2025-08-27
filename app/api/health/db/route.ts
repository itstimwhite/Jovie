import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creatorProfiles } from '@/lib/db/schema';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface HealthDetails {
  databaseUrlOk: boolean;
  count?: number | null;
  error?: string;
}

interface HealthResponse {
  service: 'db';
  status: 'ok' | 'error';
  ok: boolean;
  timestamp: string;
  details: HealthDetails;
}

export async function GET() {
  const databaseUrlOk = Boolean(env.DATABASE_URL);
  const now = new Date().toISOString();

  if (!databaseUrlOk) {
    const body: HealthResponse = {
      service: 'db',
      status: 'error',
      ok: false,
      timestamp: now,
      details: { databaseUrlOk, error: 'DATABASE_URL not configured' },
    };
    logger.warn(
      'DB healthcheck failed: configuration missing',
      body.details,
      'health/db'
    );
    return NextResponse.json(body, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  let count = null;
  let error = null;

  try {
    // Test database connection with a simple query
    const profiles = await db.select().from(creatorProfiles).limit(1);
    count = profiles.length;
  } catch (fetchError: unknown) {
    const err =
      fetchError instanceof Error ? fetchError : new Error('Unknown error');
    error = err.message;
  }

  const ok = !error;

  const body: HealthResponse = {
    service: 'db',
    status: ok ? 'ok' : 'error',
    ok,
    timestamp: now,
    details: {
      databaseUrlOk,
      count: count ?? null,
      ...(error ? { error } : {}),
    },
  };

  if (ok) {
    logger.info('DB healthcheck ok', { count }, 'health/db');
  } else {
    logger.error('DB healthcheck error', { error }, 'health/db');
  }

  return NextResponse.json(body, {
    status: ok ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
