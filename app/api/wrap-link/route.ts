/**
 * Link Wrapping API Route
 * Creates wrapped links with anti-cloaking protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createWrappedLink } from '@/lib/services/link-wrapping';
import { isValidUrl } from '@/lib/utils/url-encryption';
import { detectBot, checkRateLimit } from '@/lib/utils/bot-detection';

interface RequestBody {
  url: string;
  platform?: string;
  customAlias?: string;
  expiresInHours?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Basic bot detection (less aggressive for this endpoint)
    const _botResult = detectBot(request, '/api/wrap-link'); // eslint-disable-line @typescript-eslint/no-unused-vars
    const ip =
      request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Rate limiting
    const isRateLimited = await checkRateLimit(ip, '/api/wrap-link', 50, 60); // 50 requests per hour
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: RequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { url, customAlias, expiresInHours } = body;
    const _platform = body.platform || 'external'; // eslint-disable-line @typescript-eslint/no-unused-vars

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Get user ID if authenticated
    let userId: string | undefined;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId || undefined;
    } catch {
      // Not authenticated, continue without user ID
    }

    // Create wrapped link
    const wrappedLink = await createWrappedLink({
      url,
      userId,
      customAlias,
      expiresInHours,
    });

    if (!wrappedLink) {
      return NextResponse.json(
        { error: 'Failed to create wrapped link' },
        { status: 500 }
      );
    }

    // Return wrapped link data
    const response = NextResponse.json({
      shortId: wrappedLink.shortId,
      kind: wrappedLink.kind,
      domain: wrappedLink.domain,
      category: wrappedLink.category,
      titleAlias: wrappedLink.titleAlias,
      normalUrl: `/go/${wrappedLink.shortId}`,
      sensitiveUrl: `/out/${wrappedLink.shortId}`,
      createdAt: wrappedLink.createdAt,
      expiresAt: wrappedLink.expiresAt,
    });

    // Add security headers
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Link wrapping API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
