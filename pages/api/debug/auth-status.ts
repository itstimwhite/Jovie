import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Development-only API endpoint to debug authentication status
 * Helps compare E2E test environment vs manual browser environment
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not available in production' });
  }

  try {
    const { userId, sessionId, getToken } = getAuth(req);
    const userAgent = req.headers['user-agent'] || '';
    const ip =
      req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';

    // Get session token
    let token = null as string | null;
    let tokenError = null;
    try {
      token = await getToken();
    } catch (error) {
      console.error('Token error:', error);
      tokenError = error instanceof Error ? error.message : String(error);
    }

    const debugInfo = {
      // Authentication Status
      auth: {
        userId,
        sessionId,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null,
        tokenError,
      },

      // Environment Variables (safe subset)
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
        clerkPublishableKeyPrefix:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10),
        hasE2ECredentials: !!(
          process.env.E2E_CLERK_USER_USERNAME &&
          process.env.E2E_CLERK_USER_PASSWORD
        ),
        e2eUsername: process.env.E2E_CLERK_USER_USERNAME || null,
      },

      // Request Information
      request: {
        userAgent,
        ip: Array.isArray(ip) ? ip[0] : ip,
        method: req.method,
        url: req.url,
        headers: {
          'x-clerk-session-id': req.headers['x-clerk-session-id'],
          cookie: req.headers.cookie ? 'present' : 'missing',
        },
      },

      // Bot Detection Test
      botDetection: {
        suspiciousPatterns: [
          {
            pattern: 'curl',
            matches: userAgent.toLowerCase().includes('curl'),
          },
          {
            pattern: 'python',
            matches: userAgent.toLowerCase().includes('python'),
          },
          { pattern: 'bot', matches: userAgent.toLowerCase().includes('bot') },
          {
            pattern: 'mozilla',
            matches: userAgent.toLowerCase().includes('mozilla'),
          },
        ],
        isSuspicious:
          !userAgent.includes('Mozilla') &&
          (userAgent.toLowerCase().includes('curl') ||
            userAgent.toLowerCase().includes('python') ||
            userAgent.toLowerCase().includes('bot')),
      },

      // Recommendations
      recommendations: [] as string[],
    };

    // Add specific recommendations based on findings
    if (!debugInfo.auth.userId) {
      debugInfo.recommendations.push(
        '❌ No authenticated user - check sign-in flow'
      );
    }

    if (!debugInfo.auth.hasToken) {
      debugInfo.recommendations.push(
        '❌ No auth token - session may be expired'
      );
    }

    if (!debugInfo.environment.hasClerkPublishableKey) {
      debugInfo.recommendations.push(
        '❌ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
      );
    }

    if (!debugInfo.environment.hasClerkSecretKey) {
      debugInfo.recommendations.push('❌ Missing CLERK_SECRET_KEY');
    }

    if (!debugInfo.request.headers.cookie) {
      debugInfo.recommendations.push(
        '⚠️ No cookies present - check domain/CORS settings'
      );
    }

    if (debugInfo.botDetection.isSuspicious) {
      debugInfo.recommendations.push(
        '⚠️ User agent appears suspicious - may trigger bot protection'
      );
    }

    if (debugInfo.recommendations.length === 0) {
      debugInfo.recommendations.push(
        '✅ Environment looks healthy for authentication'
      );
    }

    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Auth debug error:', error);
    res.status(500).json({
      error: 'Failed to get auth status',
      message: error instanceof Error ? error.message : String(error),
      stack:
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.stack
            : undefined
          : undefined,
    });
  }
}
