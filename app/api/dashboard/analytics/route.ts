import { NextResponse } from 'next/server';
import { getUserAnalytics } from '@/lib/db/queries/analytics';
import { withDbSession } from '@/lib/auth/session';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export async function GET(request: Request) {
  try {
    return await withDbSession(async (userId) => {
      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const range = (searchParams.get('range') as TimeRange) || '30d';

      // Get analytics data for the current user
      const analytics = await getUserAnalytics(userId, range);

      return NextResponse.json(analytics, { status: 200 });
    });
  } catch (error) {
    console.error('Error in analytics API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
