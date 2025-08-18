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

  // For local development, convert 127.0.0.1 to localhost for Node.js fetch compatibility
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!.replace(
    '127.0.0.1',
    'localhost'
  );

  // Use a minimal SELECT with a tight range to obtain a reliable count and clearer error details.
  // Avoid head:true because HEAD responses can mask error bodies leading to empty error messages.
  let count = null;
  let error = null;

  try {
    // Use the correct key based on what's available
    const apiKey =
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Test direct fetch first to isolate the issue
    const directResponse = await fetch(
      `${supabaseUrl}/rest/v1/artists?select=id&limit=1`,
      {
        headers: {
          apikey: apiKey!,
          Authorization: `Bearer ${apiKey!}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!directResponse.ok) {
      throw new Error(
        `HTTP ${directResponse.status}: ${directResponse.statusText}`
      );
    }

    const directData = await directResponse.json();
    count = directData.length;
  } catch (fetchError) {
    error = {
      message:
        fetchError instanceof Error
          ? fetchError.message
          : 'Unknown fetch error',
      code: '',
      details: fetchError instanceof Error ? fetchError.stack : null,
      hint: 'Direct fetch failed - possible network issue',
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
