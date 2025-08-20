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

  try {
    const supabase = createServerClient();

    if (!supabase) {
      return NextResponse.json(
        { available: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('creator_profiles')
      .select('username')
      .ilike('username', handle.toLowerCase());

    if (error) {
      console.error('Error checking handle availability:', error);
      return NextResponse.json(
        { available: false, error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ available: !data || data.length === 0 });
  } catch (error) {
    console.error('Error checking handle availability:', error);
    return NextResponse.json(
      { available: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
