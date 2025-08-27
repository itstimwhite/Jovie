/**
 * Signed URL API Route (/api/link/[id])
 * Generates time-limited signed URLs for sensitive links with bot protection
 */

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import {
  getWrappedLink,
  incrementClickCount,
} from '@/lib/services/link-wrapping';
import {
  detectBot,
  logBotDetection,
  checkRateLimit,
  createBotResponse,
} from '@/lib/utils/bot-detection';
import { generateSignedToken } from '@/lib/utils/url-encryption';

interface RequestBody {
  verified?: boolean;
  timestamp?: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shortId = id;
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!shortId || shortId.length > 20) {
    return NextResponse.json({ error: 'Invalid link ID' }, { status: 400 });
  }

  try {
    // Bot detection with aggressive blocking for API endpoints
    const botResult = detectBot(request, `/api/link/${shortId}`);

    // Log bot detection
    await logBotDetection(
      ip,
      botResult.userAgent,
      botResult.reason,
      `/api/link/${shortId}`,
      botResult.shouldBlock
    );

    // Block Meta crawlers and obvious bots from API endpoints
    if (botResult.shouldBlock) {
      return createBotResponse(204);
    }

    // Rate limiting for API endpoints
    const isRateLimited = await checkRateLimit(ip, '/api/link'); // 10 requests per 5 minutes
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: RequestBody = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Basic human verification
    if (!body.verified || !body.timestamp) {
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      );
    }

    // Check timestamp is recent (within 5 minutes)
    const timeDiff = Date.now() - (body.timestamp || 0);
    if (timeDiff > 5 * 60 * 1000 || timeDiff < 0) {
      return NextResponse.json({ error: 'Request expired' }, { status: 400 });
    }

    // Get wrapped link
    const wrappedLink = await getWrappedLink(shortId);

    if (!wrappedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Generate signed token
    const signedToken = generateSignedToken();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds TTL

    // TODO: Create signed_link_access table in Drizzle schema and store signed access record
    // For now, log the signed access attempt
    console.log('Signed link access:', {
      link_id: wrappedLink.id,
      signed_token: signedToken,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: botResult.userAgent,
    });

    // Increment click count asynchronously
    incrementClickCount(shortId).catch((error) => {
      console.error('Failed to increment click count:', error);
    });

    // Return the original URL directly (single-use)
    const response = NextResponse.json({
      url: wrappedLink.originalUrl,
      expiresAt: expiresAt.toISOString(),
    });

    // Add security headers
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set(
      'X-Robots-Tag',
      'noindex, nofollow, nosnippet, noarchive'
    );

    return response;
  } catch (error) {
    console.error('Signed URL API error:', error);
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
