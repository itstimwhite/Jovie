import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedServerClient } from '@/lib/supabase-server';
import { detectPlatformFromUA } from '@/lib/utils';
import { getServerFeatureFlags } from '@/lib/feature-flags';

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

    const userAgent = request.headers.get('user-agent');
    const platformDetected = detectPlatformFromUA(userAgent || undefined);

    const flags = await getServerFeatureFlags();

    if (flags.featureClickAnalyticsRpc) {
      // Use SECURITY DEFINER RPC to safely log click events for anonymous users
      const { data: clickId, error: rpcError } = await supabase.rpc(
        'log_click_event',
        {
          handle,
          link_type: linkType,
          target,
          ua: userAgent,
          platform: platformDetected,
          link_id: linkId ?? null,
        }
      );

      if (rpcError) {
        console.error('Error logging click event via RPC:', rpcError);
        return NextResponse.json(
          { error: 'Failed to log click event' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, id: clickId ?? null });
    }

    // Fallback (flag OFF): previous direct insert semantics
    const { data: profile, error: profileError } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('username', handle)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { error: clickError } = await supabase.from('click_events').insert({
      artist_id: profile.id,
      link_type: linkType,
      target,
      ua: userAgent,
      platform_detected: platformDetected,
    });

    if (clickError) {
      console.error('Error inserting click event (fallback):', clickError);
    }

    if (linkType === 'social' && linkId) {
      const { error: updateError } = await supabase.rpc('increment_clicks', {
        link_id: linkId,
      });

      if (updateError) {
        console.error(
          'Error updating social link clicks (fallback):',
          updateError
        );
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
