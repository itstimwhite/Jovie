import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import type { SocialPlatform } from '@/types/db';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const profileId = url.searchParams.get('profileId');
  if (!profileId)
    return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });

  const supabase = createServerClient();
  if (!supabase)
    return NextResponse.json(
      { error: 'Server DB unavailable' },
      { status: 500 }
    );

  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('creator_profile_id', profileId)
    .order('sort_order', { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data ?? [] }, { status: 200 });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    profileId?: string;
    links?: Array<{
      platform: string;
      platform_type?: string;
      url: string;
      sort_order?: number;
      is_active?: boolean;
    }>;
  } | null;

  const profileId = body?.profileId;
  const links = body?.links ?? [];
  if (!profileId)
    return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });

  const supabase = createServerClient();
  if (!supabase)
    return NextResponse.json(
      { error: 'Server DB unavailable' },
      { status: 500 }
    );

  // Delete existing, then insert new
  const { error: delErr } = await supabase
    .from('social_links')
    .delete()
    .eq('creator_profile_id', profileId);
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (links.length > 0) {
    const insertPayload = links.map((l, idx) => ({
      creator_profile_id: profileId,
      platform: l.platform,
      platform_type: (l.platform_type ?? l.platform) as SocialPlatform,
      url: l.url,
      sort_order: l.sort_order ?? idx,
      is_active: l.is_active ?? true,
    }));
    const { error: insErr } = await supabase
      .from('social_links')
      .insert(insertPayload);
    if (insErr)
      return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
