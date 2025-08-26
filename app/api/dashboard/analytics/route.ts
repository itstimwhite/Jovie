import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import type { ClickEvent } from '@/types/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  if (!supabase)
    return NextResponse.json(
      { error: 'Server DB unavailable' },
      { status: 500 }
    );

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('click_events')
    .select('*')
    .gte('created_at', since30);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const events: ClickEvent[] = (data as ClickEvent[]) ?? [];
  const total_clicks = events.length;
  const spotify_clicks = events.filter((e) => e.link_type === 'listen').length;
  const social_clicks = events.filter((e) => e.link_type === 'social').length;
  const recentThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent_clicks = events.filter(
    (e) => new Date(e.created_at) > recentThreshold
  ).length;

  return NextResponse.json(
    { total_clicks, spotify_clicks, social_clicks, recent_clicks },
    { status: 200 }
  );
}
