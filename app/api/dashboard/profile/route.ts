import { NextResponse } from 'next/server';
import { withDbSession } from '@/lib/auth/session';
import { updateCreatorProfile } from '@/lib/db/queries';

export async function PUT(req: Request) {
  try {
    return await withDbSession(async userId => {
      const body = (await req.json().catch(() => null)) as {
        updates?: Record<string, unknown>;
      } | null;

      const updates = body?.updates ?? {};
      if (Object.keys(updates).length === 0) {
        return NextResponse.json(
          { error: 'No updates provided' },
          { status: 400 }
        );
      }

      // Convert camelCase to snake_case if needed and filter valid fields
      const validUpdates: Record<string, unknown> = {};
      const allowedFields = [
        'username',
        'displayName',
        'bio',
        'creatorType',
        'avatarUrl',
        'spotifyUrl',
        'appleMusicUrl',
        'youtubeUrl',
        'venmoHandle',
        'isPublic',
        'settings',
        'theme',
      ];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          validUpdates[key] = value;
        }
      }

      const updatedProfile = await updateCreatorProfile(userId, validUpdates);

      if (!updatedProfile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ profile: updatedProfile }, { status: 200 });
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
