import { NextResponse } from 'next/server';
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

  const { count, error } = await supabase
    .from('artists')
    .select('*', { count: 'estimated', head: true })
    .eq('published', true);

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
      ...(error ? { error: error.message } : {}),
    },
  };

  if (ok) {
    logger.info('DB healthcheck ok', { count }, 'health/db');
  } else {
    logger.error(
      'DB healthcheck error',
      { error: error?.message },
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
