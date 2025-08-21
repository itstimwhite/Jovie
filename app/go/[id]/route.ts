/**
 * Normal Link Redirect Route
 * /go/:id - Fast redirect for normal (non-sensitive) links
 */

import { NextRequest, NextResponse } from 'next/server';
import { getWrappedLinkInfo, incrementLinkClicks, detectBot } from '@/lib/link-wrapping';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().uuid('Invalid link ID format')
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = paramsSchema.parse(params);
    
    // Get link information
    const linkInfo = await getWrappedLinkInfo(id);
    
    if (!linkInfo) {
      return new NextResponse('Link not found', { status: 404 });
    }
    
    // Security check: Ensure this is a normal link (not sensitive)
    if (linkInfo.kind === 'sensitive') {
      // Redirect sensitive links to interstitial page
      return NextResponse.redirect(new URL(`/out/${id}`, request.url));
    }
    
    // Bot detection
    const userAgent = request.headers.get('user-agent') || '';
    const asn = request.headers.get('x-asn'); // Vercel provides this
    const botResult = detectBot(userAgent, asn || undefined);
    
    // Block Meta crawlers entirely
    if (botResult.isMeta) {
      return new NextResponse(null, { status: 204 });
    }
    
    // Log bot detection for analytics
    if (botResult.isBot) {
      console.log(`Bot detected for link ${id}: ${botResult.reason}`);
    }
    
    // Increment click count asynchronously (don't wait)
    incrementLinkClicks(id).catch(console.error);
    
    // Create redirect response with security headers
    const response = NextResponse.redirect(linkInfo.url, 302);
    
    // Add security headers
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
    
  } catch (error) {
    console.error('Error in /go/:id route:', error);
    
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid link ID', { status: 400 });
    }
    
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Block other HTTP methods
export async function POST() {
  return new NextResponse('Method not allowed', { status: 405 });
}

export async function PUT() {
  return new NextResponse('Method not allowed', { status: 405 });
}

export async function DELETE() {
  return new NextResponse('Method not allowed', { status: 405 });
}

export async function PATCH() {
  return new NextResponse('Method not allowed', { status: 405 });
}