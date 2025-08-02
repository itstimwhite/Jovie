import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedServerClient } from '@/lib/supabase-server';
import { detectPlatformFromUA } from '@/lib/utils';

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

    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('id')
      .eq('handle', handle)
      .single();

    if (artistError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const userAgent = request.headers.get('user-agent');
    const platformDetected = detectPlatformFromUA(userAgent || undefined);

    const { error: clickError } = await supabase.from('click_events').insert({
      artist_id: artist.id,
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
