/**
 * Signed URL API for Sensitive Links
 * /api/link/:id - Returns time-limited signed URLs for sensitive link access
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getWrappedLinkInfo, 
  generateSignedUrl, 
  incrementLinkClicks, 
  detectBot,
  SECURITY_HEADERS 
} from '@/lib/link-wrapping';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().uuid('Invalid link ID format')
});

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 requests per minute per IP

function getRateLimitKey(ip: string, linkId: string): string {
  return `${ip}:${linkId}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(key);
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (limit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  limit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - limit.count };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = paramsSchema.parse(params);
    
    // Get client IP for rate limiting
    const ip = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown';
    
    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, id);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return new NextResponse('Rate limit exceeded', { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0',
          ...SECURITY_HEADERS
        }
      });
    }
    
    // Bot detection
    const userAgent = request.headers.get('user-agent') || '';
    const asn = request.headers.get('x-asn'); // Vercel provides this
    const botResult = detectBot(userAgent, asn || undefined);
    
    // Block all bots and crawlers
    if (botResult.isBot) {
      console.log(`Bot blocked from /api/link/${id}: ${botResult.reason}`);
      return new NextResponse(null, { 
        status: 404,
        headers: SECURITY_HEADERS
      });
    }
    
    // Get link information
    const linkInfo = await getWrappedLinkInfo(id);
    
    if (!linkInfo) {
      return new NextResponse('Link not found', { 
        status: 404,
        headers: SECURITY_HEADERS
      });
    }
    
    // Security check: Only sensitive links should use this API
    if (linkInfo.kind !== 'sensitive') {
      return new NextResponse('Not a sensitive link', { 
        status: 400,
        headers: SECURITY_HEADERS
      });
    }
    
    // Generate signed URL with short expiry (60 seconds)
    const signedToken = await generateSignedUrl(id, 60);
    
    if (!signedToken) {
      return new NextResponse('Failed to generate signed URL', { 
        status: 500,
        headers: SECURITY_HEADERS
      });
    }
    
    // Increment click count asynchronously (don't wait)
    incrementLinkClicks(id).catch(console.error);
    
    // Return the actual target URL (not exposed in HTML/JSON until this point)
    const response = NextResponse.json(
      { 
        url: linkInfo.url,
        domain: linkInfo.domain,
        token: signedToken,
        expires_in: 60
      },
      {
        status: 200,
        headers: {
          ...SECURITY_HEADERS,
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      }
    );
    
    return response;
    
  } catch (error) {
    console.error('Error in /api/link/:id route:', error);
    
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid link ID', { 
        status: 400,
        headers: SECURITY_HEADERS
      });
    }
    
    return new NextResponse('Internal server error', { 
      status: 500,
      headers: SECURITY_HEADERS
    });
  }
}

// Block other HTTP methods
export async function POST() {
  return new NextResponse('Method not allowed', { 
    status: 405,
    headers: SECURITY_HEADERS
  });
}

export async function PUT() {
  return new NextResponse('Method not allowed', { 
    status: 405,
    headers: SECURITY_HEADERS
  });
}

export async function DELETE() {
  return new NextResponse('Method not allowed', { 
    status: 405,
    headers: SECURITY_HEADERS
  });
}

export async function PATCH() {
  return new NextResponse('Method not allowed', { 
    status: 405,
    headers: SECURITY_HEADERS
  });
}