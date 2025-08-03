import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { available: false, error: 'Handle is required' },
      { status: 400 }
    );
  }

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('artists')
    .select('handle')
    .eq('handle', handle);

  return NextResponse.json({ available: !data || data.length === 0 });
}
