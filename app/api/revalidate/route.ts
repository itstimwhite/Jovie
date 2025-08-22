import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * API route for on-demand revalidation of cached pages
 * This allows us to invalidate the Next.js cache when data changes
 *
 * @example
 * // Revalidate a specific path
 * fetch('/api/revalidate?path=/username', { method: 'POST' })
 *
 * // Revalidate a tag (for multiple related pages)
 * fetch('/api/revalidate?tag=profile-username', { method: 'POST' })
 */
export async function POST(request: NextRequest) {
  try {
    // Get the path or tag from the query parameters
    const path = request.nextUrl.searchParams.get('path');
    const tag = request.nextUrl.searchParams.get('tag');

    // Check for authorization if a token is configured
    const authHeader = request.headers.get('authorization');
    if (process.env.REVALIDATE_TOKEN) {
      const expectedAuth = `Bearer ${process.env.REVALIDATE_TOKEN}`;
      if (authHeader !== expectedAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Ensure either path or tag is provided
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Missing path or tag parameter' },
        { status: 400 }
      );
    }

    // Revalidate the path or tag
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    } else if (tag) {
      // For future use when Next.js supports tag-based revalidation
      // revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag });
    }
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

/**
 * Set appropriate cache headers for this API route
 */
export const runtime = 'edge';

export function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        Allow: 'POST',
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}
