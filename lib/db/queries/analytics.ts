import { and, gte, sql, count, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { clickEvents } from '@/lib/db/schema';

type TimeRange = '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
  totalClicks: number;
  spotifyClicks: number;
  socialClicks: number;
  recentClicks: number;
  clicksByDay: { date: string; count: number }[];
  topLinks: { id: string; url: string; clicks: number }[];
}

export async function getAnalyticsData(
  creatorProfileId: string,
  range: TimeRange = '30d'
): Promise<AnalyticsData> {
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

  // Get total counts for this creator
  const [totalClicks, spotifyClicks, socialClicks] = await Promise.all([
    db
      .select({ count: count() })
      .from(clickEvents)
      .where(eq(clickEvents.creatorProfileId, creatorProfileId)),
    db
      .select({ count: count() })
      .from(clickEvents)
      .where(
        and(
          eq(clickEvents.creatorProfileId, creatorProfileId),
          eq(clickEvents.linkType, 'listen')
        )
      ),
    db
      .select({ count: count() })
      .from(clickEvents)
      .where(
        and(
          eq(clickEvents.creatorProfileId, creatorProfileId),
          eq(clickEvents.linkType, 'social')
        )
      ),
  ]);

  // Get recent clicks (last 7 days)
  const recentThreshold = new Date();
  recentThreshold.setDate(recentThreshold.getDate() - 7);
  const recentClicks = await db
    .select({ count: count() })
    .from(clickEvents)
    .where(
      and(
        eq(clickEvents.creatorProfileId, creatorProfileId),
        gte(clickEvents.createdAt, recentThreshold)
      )
    )
    .then((res) => res[0]?.count ?? 0);

  // Get clicks by day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const clicksByDay = await db
    .select({
      date: sql<string>`DATE(${clickEvents.createdAt})`,
      count: count(),
    })
    .from(clickEvents)
    .where(
      and(
        eq(clickEvents.creatorProfileId, creatorProfileId),
        gte(clickEvents.createdAt, thirtyDaysAgo)
      )
    )
    .groupBy(sql`DATE(${clickEvents.createdAt})`)
    .orderBy(sql`DATE(${clickEvents.createdAt})`);

  // Get top links
  const topLinks = await db
    .select({
      id: clickEvents.linkId,
      url: clickEvents.linkType,
      count: count(),
    })
    .from(clickEvents)
    .where(eq(clickEvents.creatorProfileId, creatorProfileId))
    .groupBy(clickEvents.linkId, clickEvents.linkType)
    .orderBy(sql`count DESC`)
    .limit(5);

  return {
    totalClicks: totalClicks[0]?.count ?? 0,
    spotifyClicks: spotifyClicks[0]?.count ?? 0,
    socialClicks: socialClicks[0]?.count ?? 0,
    recentClicks,
    clicksByDay: clicksByDay.map((row) => ({
      date: row.date,
      count: Number(row.count),
    })),
    topLinks: topLinks.map((row) => ({
      id: row.id ?? 'unknown',
      url: row.url,
      clicks: Number(row.count),
    })),
  };
}

// Helper function to get analytics for the current user
export async function getUserAnalytics(
  userId: string,
  range: TimeRange = '30d'
) {
  // First get the creator profile for this user
  const creatorProfile = await db.query.creatorProfiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, userId),
  });

  if (!creatorProfile) {
    throw new Error('Creator profile not found');
  }

  return getAnalyticsData(creatorProfile.id, range);
}

// Function to record a click event
export async function recordClickEvent(
  creatorProfileId: string,
  linkType: 'listen' | 'social' | 'other',
  linkId?: string,
  metadata: Record<string, unknown> = {}
) {
  const request = {
    creatorProfileId,
    linkType,
    ...(linkId && { linkId }),
    ...metadata,
  };

  const [event] = await db.insert(clickEvents).values(request).returning();

  return event;
}
