import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    profileId?: string;
    updates?: Record<string, unknown>;
  } | null;

  const profileId = body?.profileId;
  const updates = body?.updates ?? {};
  if (!profileId)
    return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });

  const supabase = createServerClient();
  if (!supabase)
    return NextResponse.json(
      { error: 'Server DB unavailable' },
      { status: 500 }
    );

  const { data, error } = await supabase
    .from('creator_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json({ profile: data }, { status: 200 });
}
