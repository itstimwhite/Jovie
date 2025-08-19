import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedServerClient } from '@/lib/supabase-server';
import { detectPlatformFromUA } from '@/lib/utils';

// API routes should be dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, linkType, target, linkId } = body;

    if (!handle || !linkType || !target) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('username', handle)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const userAgent = request.headers.get('user-agent');
    const platformDetected = detectPlatformFromUA(userAgent || undefined);

    const { error: clickError } = await supabase.from('click_events').insert({
      artist_id: profile.id,
      link_type: linkType,
      target,
      ua: userAgent,
      platform_detected: platformDetected,
    });

    if (clickError) {
      console.error('Error inserting click event:', clickError);
    }

    if (linkType === 'social' && linkId) {
      const { error: updateError } = await supabase.rpc('increment_clicks', {
        link_id: linkId,
      });

      if (updateError) {
        console.error('Error updating social link clicks:', updateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
