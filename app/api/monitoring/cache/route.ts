/**
 * Cache performance monitoring API
 * Provides insights into cache hit rates and performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { cacheMonitoring, profileCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const metrics = await cacheMonitoring.getCacheMetrics();
    const performanceCheck = await cacheMonitoring.checkPerformanceTargets();
    
    return NextResponse.json({
      metrics,
      performanceTargets: {
        met: performanceCheck,
        targetHitRate: 0.85,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cache monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track_hit':
        cacheMonitoring.trackCacheHit(data.layer, data.key);
        break;
      case 'track_miss':
        cacheMonitoring.trackCacheMiss(data.layer, data.key);
        break;
      case 'alert_check':
        await cacheMonitoring.alertOnPoorPerformance();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cache monitoring action error:', error);
    return NextResponse.json(
      { error: 'Failed to process monitoring action' },
      { status: 500 }
    );
  }
}

// Cache this endpoint for 1 minute
export async function headers() {
  return {
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  };
}

// Enable edge runtime
export const runtime = 'edge';