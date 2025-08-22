/**
 * Bot Detection Utilities with Anti-Cloaking Compliance
 * Conservative bot detection to avoid anti-cloaking penalties
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface BotDetectionResult {
  isBot: boolean;
  isMeta: boolean;
  reason: string;
  shouldBlock: boolean;
  userAgent: string;
  asn?: number;
}

// Meta/Facebook ASNs that should be handled carefully
const META_ASNS = [
  32934, // Facebook, Inc.
  63293, // Facebook, Inc.
];

// Conservative bot detection - only block obvious crawlers on sensitive endpoints
const META_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'facebook',
  'Instagram',
  'WhatsApp',
];

// Other crawlers to monitor (but not necessarily block)
const KNOWN_CRAWLERS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'applebot',
  'twitterbot',
  'linkedinbot',
  'pinterestbot',
  'discordbot',
  'telegrambot',
  'skypebot',
];

/**
 * Detects if request is from a bot with anti-cloaking considerations
 */
export function detectBot(
  request: NextRequest,
  endpoint?: string
): BotDetectionResult {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || '';

  // Check for Meta crawlers
  const isMeta = META_USER_AGENTS.some((agent) =>
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );

  // Check for other known crawlers
  const isKnownCrawler = KNOWN_CRAWLERS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  const isBot = isMeta || isKnownCrawler;

  // Determine blocking strategy based on endpoint
  let shouldBlock = false;
  let reason = '';

  if (isMeta) {
    reason = 'Meta crawler detected';
    // Only block Meta crawlers on sensitive API endpoints
    shouldBlock =
      endpoint?.includes('/api/link/') || endpoint?.includes('/api/sign/');
  } else if (isKnownCrawler) {
    reason = 'Known crawler detected';
    // Don't block other crawlers to avoid anti-cloaking issues
    shouldBlock = false;
  }

  return {
    isBot,
    isMeta,
    reason,
    shouldBlock,
    userAgent,
  };
}

/**
 * Checks if IP belongs to Meta ASN
 */
export async function checkMetaASN(ip: string): Promise<boolean> {
  // In production, you'd query an IP-to-ASN service
  // For demo, we'll just return false to avoid blocking legitimate users
  return false;
}

/**
 * Logs bot detection for monitoring
 */
export async function logBotDetection(
  ip: string,
  userAgent: string,
  reason: string,
  endpoint: string,
  blocked: boolean,
  asn?: number
): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from('bot_detection_log').insert({
      ip_address: ip,
      user_agent: userAgent,
      asn,
      blocked_reason: blocked ? reason : null,
      endpoint,
    });
  } catch (error) {
    console.error('Failed to log bot detection:', error);
  }
}

/**
 * Conservative rate limiting to avoid appearing like cloaking
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number = 100,
  windowMinutes: number = 60
): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - windowMinutes);

    // Check current request count in window
    const { data, error } = await supabase
      .from('link_rate_limits')
      .select('request_count')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Rate limit check failed:', error);
      return false; // Allow on error to avoid false positives
    }

    const currentCount = data?.request_count || 0;

    if (currentCount >= limit) {
      return true; // Rate limited
    }

    // Update or insert rate limit record
    await supabase.from('link_rate_limits').upsert(
      {
        ip_address: ip,
        endpoint,
        request_count: currentCount + 1,
        window_start: new Date().toISOString(),
      },
      {
        onConflict: 'ip_address,endpoint,window_start',
      }
    );

    return false; // Not rate limited
  } catch (error) {
    console.error('Rate limiting error:', error);
    return false; // Allow on error
  }
}

/**
 * Generates anti-cloaking safe error responses
 */
export function createBotResponse(status: number = 204): Response {
  // Return consistent responses to avoid cloaking detection
  if (status === 404) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  return new Response('', {
    status: 204,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}

/**
 * Checks if request should be treated as suspicious
 */
export function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  // Check for suspicious patterns
  const suspiciousPatterns = [
    // Empty or suspicious user agents
    /^$/,
    /curl/i,
    /wget/i,
    /python/i,
    /bot/i,
    /spider/i,
    /crawler/i,
    // But don't block legitimate tools that might be used by users
  ];

  // Only flag obviously suspicious requests
  const hasSuspiciousUA =
    suspiciousPatterns.some((pattern) => pattern.test(userAgent)) &&
    !userAgent.includes('Mozilla'); // Don't flag browser-based tools

  return hasSuspiciousUA;
}

/**
 * Gets appropriate response headers for different client types
 */
export function getBotSafeHeaders(isBot: boolean): Record<string, string> {
  const baseHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive',
  };

  if (isBot) {
    return {
      ...baseHeaders,
      'Referrer-Policy': 'no-referrer',
    };
  }

  return baseHeaders;
}
