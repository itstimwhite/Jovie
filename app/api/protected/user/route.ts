import { NextRequest, NextResponse } from 'next/server';
import { withAuthGuard } from '@/lib/auth/api-guard';
import { createServerClient } from '@/lib/supabase-server';

// Protected API route that returns user data
// Uses the withAuthGuard wrapper to handle authentication
export const GET = withAuthGuard(async (req: NextRequest) => {
  try {
    const supabase = createServerClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Get user data from Supabase
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error in protected user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Example of a protected POST endpoint
export const POST = withAuthGuard(async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Process the request...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in protected user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

