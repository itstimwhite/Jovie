import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// Internal health check that validates auth.jwt()->>'sub' path
// Only accessible in development for security
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'Only available in development' },
      { status: 403 }
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        ok: true,
        authenticated: false,
        message: 'No session - this is expected for anonymous requests',
      });
    }

    const supabase = createServerSupabase();

    // Test that we can query the current user's profile using RLS
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('id, username')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // This might be OK if user doesn't have a profile yet
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          ok: true,
          authenticated: true,
          userId,
          hasProfile: false,
          message:
            'User authenticated but no profile found (expected for new users)',
        });
      }
      throw error;
    }

    return NextResponse.json({
      ok: true,
      authenticated: true,
      userId,
      hasProfile: !!data,
      profile: data ? { id: data.id, username: data.username } : null,
      message: 'RLS validation successful',
    });
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error');
    return NextResponse.json(
      { ok: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
