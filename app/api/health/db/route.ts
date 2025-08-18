import { NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
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

  const now = new Date().toISOString();

  if (!urlOk || !keyOk) {
    const body: HealthResponse = {
      service: 'db',
      status: 'error',
      ok: false,
      timestamp: now,
      details: { urlOk, keyOk, error: 'Supabase configuration missing' },
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

  // Use URL as configured - no need for conversion since it's already localhost
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!;

  // Use Supabase client instead of direct fetch to avoid Node.js fetch issues
  let count = null;
  let error = null;

  try {
    const { createClient } = await import('@supabase/supabase-js');

    // Use the correct key based on what's available
    const apiKey =
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, apiKey!);

    const { data, error: supabaseError } = await supabase
      .from('artist_profiles')
      .select('id')
      .limit(1);

    if (supabaseError) throw supabaseError;

    count = data?.length || 0;
  } catch (fetchError: unknown) {
    const err =
      fetchError instanceof Error ? fetchError : new Error('Unknown error');
    error = {
      message: err.message,
      code: (err as Error & { code?: string })?.code || '',
      details: (err as Error & { details?: string })?.details || null,
      hint: (err as Error & { hint?: string })?.hint || 'Database query failed',
    };
  }

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
