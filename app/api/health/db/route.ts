import { NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase-server';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface HealthDetails {
  urlOk: boolean;
  keyOk: boolean;
  count?: number | null;
  error?: string;
  errorCode?: string;
  errorDetails?: string | null;
  errorHint?: string | null;
}

interface HealthResponse {
  service: 'db';
  status: 'ok' | 'error';
  ok: boolean;
  timestamp: string;
  details: HealthDetails;
}

export async function GET() {
  const urlOk = Boolean(env.NEXT_PUBLIC_SUPABASE_URL);
  const keyOk = Boolean(
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const supabase = createServerClient();
  const now = new Date().toISOString();

  if (!supabase) {
    const body: HealthResponse = {
      service: 'db',
      status: 'error',
      ok: false,
      timestamp: now,
      details: { urlOk, keyOk, error: 'Supabase client not configured' },
    };
    logger.warn(
      'DB healthcheck failed: client not configured',
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

  // Use a minimal SELECT with a tight range to obtain a reliable count and clearer error details.
  // Avoid head:true because HEAD responses can mask error bodies leading to empty error messages.
  const { count, error } = await supabase
    .from('artists')
    .select('id', { count: 'estimated' })
    .eq('published', true)
    .range(0, 0);

  const ok = !error;

  const body: HealthResponse = {
    service: 'db',
    status: ok ? 'ok' : 'error',
    ok,
    timestamp: now,
    details: {
      urlOk,
      keyOk,
      count: count ?? null,
      ...(error
        ? {
            error: (error as PostgrestError).message,
            errorCode: (error as PostgrestError).code,
            errorDetails: (error as PostgrestError).details ?? null,
            errorHint: (error as PostgrestError).hint ?? null,
          }
        : {}),
    },
  };

  if (ok) {
    logger.info('DB healthcheck ok', { count }, 'health/db');
  } else {
    const e = error as PostgrestError | null;
    logger.error(
      'DB healthcheck error',
      {
        message: e?.message ?? null,
        code: e?.code ?? null,
        details: e?.details ?? null,
        hint: e?.hint ?? null,
      },
      'health/db'
    );
  }

  return NextResponse.json(body, {
    status: ok ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
