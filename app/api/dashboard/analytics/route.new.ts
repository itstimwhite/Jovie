import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { clickEvents } from '@/lib/db/schema';
import { and, gte } from 'drizzle-orm';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = url.searchParams.get('range') || '30d';

  try {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0); // Unix epoch
        break;
    }

    // Ensure we have a valid date
    if (isNaN(startDate.getTime())) {
      startDate = new Date(0); // Fallback to epoch if invalid date
    }

    // Calculate seven days ago for recent clicks
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Get all click events for the user in the specified date range
    const events = await db
      .select()
      .from(clickEvents)
      .where(and(gte(clickEvents.createdAt, startDate)))
      .execute();

    // Calculate metrics
    const totalClicks = events.length;
    const spotifyClicks = events.filter((e) => e.linkType === 'listen').length;
    const socialClicks = events.filter((e) => e.linkType === 'social').length;
    const recentClicks = events.filter(
      (e) => new Date(e.createdAt) >= sevenDaysAgo
    ).length;

    return NextResponse.json(
      {
        total_clicks: totalClicks,
        spotify_clicks: spotifyClicks,
        social_clicks: socialClicks,
        recent_clicks: recentClicks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
