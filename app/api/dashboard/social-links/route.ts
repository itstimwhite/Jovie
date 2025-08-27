import { NextResponse } from 'next/server';
import { withDbSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { socialLinks, creatorProfiles, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    return await withDbSession(async (clerkUserId) => {
      const url = new URL(req.url);
      const profileId = url.searchParams.get('profileId');
      if (!profileId) {
        return NextResponse.json(
          { error: 'Missing profileId' },
          { status: 400 }
        );
      }

      // Verify the profile belongs to the authenticated user
      const [profile] = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .innerJoin(users, eq(users.id, creatorProfiles.userId))
        .where(
          and(eq(creatorProfiles.id, profileId), eq(users.clerkId, clerkUserId))
        )
        .limit(1);

      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      const links = await db
        .select()
        .from(socialLinks)
        .where(eq(socialLinks.creatorProfileId, profileId))
        .orderBy(socialLinks.sortOrder);

      return NextResponse.json({ links }, { status: 200 });
    });
  } catch (error) {
    console.error('Error fetching social links:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    return await withDbSession(async (clerkUserId) => {
      const body = (await req.json().catch(() => null)) as {
        profileId?: string;
        links?: Array<{
          platform: string;
          platformType?: string;
          url: string;
          sortOrder?: number;
          isActive?: boolean;
          displayText?: string;
        }>;
      } | null;

      const profileId = body?.profileId;
      const links = body?.links ?? [];
      if (!profileId) {
        return NextResponse.json(
          { error: 'Missing profileId' },
          { status: 400 }
        );
      }

      // Verify the profile belongs to the authenticated user
      const [profile] = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .innerJoin(users, eq(users.id, creatorProfiles.userId))
        .where(
          and(eq(creatorProfiles.id, profileId), eq(users.clerkId, clerkUserId))
        )
        .limit(1);

      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      // Delete existing links
      await db
        .delete(socialLinks)
        .where(eq(socialLinks.creatorProfileId, profileId));

      // Insert new links
      if (links.length > 0) {
        const insertPayload = links.map((l, idx) => ({
          creatorProfileId: profileId,
          platform: l.platform,
          platformType: l.platformType ?? l.platform,
          url: l.url,
          sortOrder: l.sortOrder ?? idx,
          isActive: l.isActive ?? true,
          displayText: l.displayText || null,
        }));

        await db.insert(socialLinks).values(insertPayload);
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
