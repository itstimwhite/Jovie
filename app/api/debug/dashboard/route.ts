import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('Debug API - userId:', userId);

    if (!userId) {
      return NextResponse.json({
        error: 'No user ID',
        userId: null,
        authenticated: false,
      });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({
        error: 'Failed to create Supabase client',
        userId,
        authenticated: true,
        supabaseClient: false,
      });
    }

    // Test direct queries
    const userQuery = await supabase
      .from('app_users')
      .select('*')
      .eq('id', userId);

    const profilesQuery = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('user_id', userId);

    return NextResponse.json({
      userId,
      authenticated: true,
      supabaseClient: true,
      userQuery: {
        data: userQuery.data,
        error: userQuery.error,
        count: userQuery.data?.length || 0,
      },
      profilesQuery: {
        data: profilesQuery.data,
        error: profilesQuery.error,
        count: profilesQuery.data?.length || 0,
      },
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
