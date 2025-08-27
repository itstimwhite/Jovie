import { sql as drizzleSql, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clickEvents, creatorProfiles, socialLinks } from '@/lib/db/schema';
import { detectPlatformFromUA } from '@/lib/utils';
import { LinkType } from '@/types/db';

// API routes should be dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      handle,
      linkType,
      target,
      linkId,
    }: {
      handle: string;
      linkType: LinkType;
      target: string;
      linkId?: string;
    } = body;

    if (!handle || !linkType || !target) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent');
    const platformDetected = detectPlatformFromUA(userAgent || undefined);
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      null;

    // Find the creator profile
    const [profile] = await db
      .select({ id: creatorProfiles.id })
      .from(creatorProfiles)
      .where(eq(creatorProfiles.usernameNormalized, handle.toLowerCase()))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Record the click event
    const [clickEvent] = await db
      .insert(clickEvents)
      .values({
        creatorProfileId: profile.id,
        linkType: linkType as 'listen' | 'social' | 'tip' | 'other', // Cast to enum type
        linkId: linkId || null,
        ipAddress: ipAddress,
        userAgent: userAgent,
        deviceType: platformDetected,
        metadata: { target },
      })
      .returning({ id: clickEvents.id });

    if (!clickEvent) {
      console.error('Failed to insert click event');
      return NextResponse.json(
        { error: 'Failed to log click event' },
        { status: 500 }
      );
    }

    // Increment social link click count if applicable
    if (linkType === 'social' && linkId) {
      await db
        .update(socialLinks)
        .set({
          clicks: drizzleSql`${socialLinks.clicks} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(socialLinks.id, linkId));
    }

    return NextResponse.json({ success: true, id: clickEvent.id });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
