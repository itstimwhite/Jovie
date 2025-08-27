import { NextResponse } from 'next/server';
import { checkDbHealth, getDbConfig } from '@/lib/db';
import { env } from '@/lib/env';
import { validateDatabaseEnvironment } from '@/lib/startup/environment-validator';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface HealthDetails {
  databaseUrlOk: boolean;
  databaseUrlValid: boolean;
  latency?: number;
  error?: string;
  config?: ReturnType<typeof getDbConfig>;
  validationError?: string;
  checks?: {
    connection: boolean;
    query: boolean;
    transaction: boolean;
    schemaAccess: boolean;
  };
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
  const config = getDbConfig();

  // Validate database environment
  const dbValidation = validateDatabaseEnvironment();

  if (!databaseUrlOk || !dbValidation.valid) {
    const body: HealthResponse = {
      service: 'db',
      status: 'error',
      ok: false,
      timestamp: now,
      details: {
        databaseUrlOk,
        databaseUrlValid: dbValidation.valid,
        error: !databaseUrlOk
          ? 'DATABASE_URL not configured'
          : 'DATABASE_URL validation failed',
        validationError: dbValidation.error,
        config,
      },
    };
    logger.warn(
      'DB healthcheck failed: configuration or validation error',
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

  // Use the enhanced database health check with retry logic
  const healthResult = await checkDbHealth();

  const body: HealthResponse = {
    service: 'db',
    status: healthResult.healthy ? 'ok' : 'error',
    ok: healthResult.healthy,
    timestamp: now,
    details: {
      databaseUrlOk,
      databaseUrlValid: dbValidation.valid,
      latency: healthResult.latency,
      checks: healthResult.details,
      ...(healthResult.error ? { error: healthResult.error } : {}),
      config,
    },
  };

  if (healthResult.healthy) {
    logger.info(
      'DB healthcheck ok',
      {
        latency: healthResult.latency,
      },
      'health/db'
    );
  } else {
    logger.error(
      'DB healthcheck error',
      {
        error: healthResult.error,
        latency: healthResult.latency,
      },
      'health/db'
    );
  }

  return NextResponse.json(body, {
    status: healthResult.healthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
