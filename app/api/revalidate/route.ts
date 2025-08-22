/**
 * API route for manual cache revalidation
 * Allows cache invalidation to be triggered programmatically
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_SECRET || 'dev-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tags, paths } = body;

    // Revalidate specific tags
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        revalidateTag(tag);
      });
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((path: string) => {
        revalidatePath(path);
      });
    }

    return NextResponse.json({ 
      revalidated: true,
      tags: tags || [],
      paths: paths || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Enable edge runtime for faster response
export const runtime = 'edge';