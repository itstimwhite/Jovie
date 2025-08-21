import { createAnonymousServerClient } from '@/lib/supabase-server';
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

  // Validate handle format
  if (handle.length < 3) {
    return NextResponse.json(
      { available: false, error: 'Handle must be at least 3 characters' },
      { status: 400 }
    );
  }

  if (handle.length > 30) {
    return NextResponse.json(
      { available: false, error: 'Handle must be less than 30 characters' },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9-]+$/.test(handle)) {
    return NextResponse.json(
      {
        available: false,
        error: 'Handle can only contain letters, numbers, and hyphens',
      },
      { status: 400 }
    );
  }

  try {
    // Use anonymous client since handle checking doesn't require authentication
    const supabase = createAnonymousServerClient();

    if (!supabase) {
      return NextResponse.json(
        { available: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const handleLower = handle.toLowerCase();
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('username')
      .eq('username', handleLower);

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
