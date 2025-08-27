import { NextResponse } from 'next/server';
import { checkDbPerformance, getDbConfig } from '@/lib/db';
import { env } from '@/lib/env';
import { validateDatabaseEnvironment } from '@/lib/startup/environment-validator';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PerformanceHealthResponse {
  service: 'db-performance';
  status: 'ok' | 'warning' | 'error';
  ok: boolean;
  timestamp: string;
  details: {
    databaseUrlOk: boolean;
    databaseUrlValid: boolean;
    metrics?: {
      simpleQuery?: number;
      complexQuery?: number;
      transactionTime?: number;
      concurrentConnections?: number;
    };
    thresholds: {
      simpleQueryMax: number;
      transactionTimeMax: number;
    };
    error?: string;
    validationError?: string;
    config?: ReturnType<typeof getDbConfig>;
  };
}

export async function GET() {
  const databaseUrlOk = Boolean(env.DATABASE_URL);
  const now = new Date().toISOString();
  const config = getDbConfig();

  // Performance thresholds
  const thresholds = {
    simpleQueryMax: 1000, // 1 second
    transactionTimeMax: 2000, // 2 seconds
  };

  // Validate database environment first
  const dbValidation = validateDatabaseEnvironment();

  if (!databaseUrlOk || !dbValidation.valid) {
    const body: PerformanceHealthResponse = {
      service: 'db-performance',
      status: 'error',
      ok: false,
      timestamp: now,
      details: {
        databaseUrlOk,
        databaseUrlValid: dbValidation.valid,
        thresholds,
        error: !databaseUrlOk
          ? 'DATABASE_URL not configured'
          : 'DATABASE_URL validation failed',
        validationError: dbValidation.error,
        config,
      },
    };

    logger.warn(
      'DB performance healthcheck failed: configuration or validation error',
      body.details,
      'health/db/performance'
    );

    return NextResponse.json(body, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  // Run comprehensive performance health check
  const performanceResult = await checkDbPerformance();

  // Determine status based on performance metrics
  let status: 'ok' | 'warning' | 'error' = 'ok';
  let ok = true;

  if (!performanceResult.healthy) {
    status = 'error';
    ok = false;
  } else {
    // Check for warning conditions (slower than optimal but not critical)
    const simpleQuerySlow =
      (performanceResult.metrics.simpleQuery || 0) >
      thresholds.simpleQueryMax * 0.5;
    const transactionSlow =
      (performanceResult.metrics.transactionTime || 0) >
      thresholds.transactionTimeMax * 0.5;

    if (simpleQuerySlow || transactionSlow) {
      status = 'warning';
      // Still ok=true for warnings, just indicates suboptimal performance
    }
  }

  const body: PerformanceHealthResponse = {
    service: 'db-performance',
    status,
    ok,
    timestamp: now,
    details: {
      databaseUrlOk,
      databaseUrlValid: dbValidation.valid,
      metrics: performanceResult.metrics,
      thresholds,
      ...(performanceResult.error ? { error: performanceResult.error } : {}),
      config,
    },
  };

  if (ok) {
    logger.info(
      'DB performance healthcheck ok',
      {
        metrics: performanceResult.metrics,
        status,
      },
      'health/db/performance'
    );
  } else {
    logger.error(
      'DB performance healthcheck failed',
      {
        error: performanceResult.error,
        metrics: performanceResult.metrics,
      },
      'health/db/performance'
    );
  }

  return NextResponse.json(body, {
    status: ok ? (status === 'warning' ? 200 : 200) : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
