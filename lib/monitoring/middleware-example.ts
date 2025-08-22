/**
 * Example middleware integration for API metrics
 * 
 * This file demonstrates how to integrate the sendApiMetric function
 * with Next.js middleware for comprehensive API monitoring.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendApiMetric } from './api';

/**
 * Middleware function that wraps API requests with timing and metrics
 */
export async function withApiMetrics(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Start timing
  const startTime = performance.now();
  
  try {
    // Process the request
    const response = await handler(req);
    
    // Calculate duration
    const duration = performance.now() - startTime;
    
    // Send metrics
    sendApiMetric({
      path: req.nextUrl.pathname,
      method: req.method,
      statusCode: response.status,
      duration,
      source: 'middleware',
      // Optional: Add response size if available
      size: parseInt(response.headers.get('content-length') || '0', 10) || undefined,
      // Optional: Add cache status
      cached: response.headers.get('x-cache') === 'HIT',
    });
    
    return response;
  } catch (error) {
    // Calculate duration even for errors
    const duration = performance.now() - startTime;
    
    // Send error metrics
    sendApiMetric({
      path: req.nextUrl.pathname,
      method: req.method,
      statusCode: 500, // Assume 500 for uncaught errors
      duration,
      source: 'middleware',
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Re-throw the error to be handled by the error boundary
    throw error;
  }
}

/**
 * Example usage in a Next.js API route:
 * 
 * ```typescript
 * // app/api/example/route.ts
 * import { NextRequest } from 'next/server';
 * import { withApiMetrics } from '@/lib/monitoring/middleware-example';
 * 
 * export async function GET(req: NextRequest) {
 *   return withApiMetrics(req, async () => {
 *     // Your API logic here
 *     return NextResponse.json({ success: true });
 *   });
 * }
 * ```
 */

