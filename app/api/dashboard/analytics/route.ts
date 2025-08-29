import { NextResponse } from 'next/server';
import { withDbSession } from '@/lib/auth/session';
import { getUserAnalytics } from '@/lib/db/queries/analytics';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export async function GET(request: Request) {
  try {
    return await withDbSession(async userId => {
      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const range = (searchParams.get('range') as TimeRange) || '30d';

      // Get analytics data for the current user
      const analytics = await getUserAnalytics(userId, range);

      // Normalize to snake_case for client expectations
      const payload = {
        total_clicks: analytics.totalClicks ?? 0,
        spotify_clicks: analytics.spotifyClicks ?? 0,
        social_clicks: analytics.socialClicks ?? 0,
        recent_clicks: analytics.recentClicks ?? 0,
      };

      return NextResponse.json(payload, { status: 200 });
    });
  } catch (error) {
    console.error('Error in analytics API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Gracefully handle missing user/profile by returning zeroed stats
    if (
      error instanceof Error &&
      (error.message.includes('User not found for Clerk ID') ||
        error.message.includes('Creator profile not found'))
    ) {
      return NextResponse.json(
        {
          total_clicks: 0,
          spotify_clicks: 0,
          social_clicks: 0,
          recent_clicks: 0,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
