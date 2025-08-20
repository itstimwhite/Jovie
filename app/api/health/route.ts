import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export async function GET() {
  const summary: Record<string, unknown> = {
    time: new Date().toISOString(),
    env: process.env.VERCEL_ENV || 'local',
    branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || null,
  };

  try {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      summary.status = 'degraded';
      summary.supabase = { ok: false, error: 'missing_supabase_env' };
      return NextResponse.json(summary, { status: 200 });
    }

    const sb = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Count public creator profiles (seed invariant: should be >= 3)
    const { error, count } = await sb
      .from('creator_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);

    if (error) {
      summary.status = 'degraded';
      summary.supabase = { ok: false, error: error.message };
      return NextResponse.json(summary, { status: 200 });
    }

    summary.status = 'ok';
    summary.supabase = { ok: true, publicProfiles: count ?? 0 };
    return NextResponse.json(summary, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    summary.status = 'degraded';
    summary.supabase = {
      ok: false,
      error: e instanceof Error ? e.message : 'unknown',
    };
    return NextResponse.json(summary, { status: 200 });
  }
}
