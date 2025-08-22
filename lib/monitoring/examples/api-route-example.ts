/**
 * Example of using API metrics in a Next.js API route
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendApiMetric } from '../api';

export async function GET(req: NextRequest) {
  const startTime = performance.now();
  
  try {
    // Your API logic here
    const data = { message: 'Hello, world!' };
    
    // Calculate duration
    const duration = performance.now() - startTime;
    
    // Send success metrics
    sendApiMetric({
      path: req.nextUrl.pathname,
      method: req.method,
      statusCode: 200,
      duration,
      source: 'server',
      metadata: {
        cacheHit: false,
        contentType: 'application/json',
      },
    });
    
    return NextResponse.json(data);
  } catch (error) {
    // Calculate duration even for errors
    const duration = performance.now() - startTime;
    
    // Send error metrics
    sendApiMetric({
      path: req.nextUrl.pathname,
      method: req.method,
      statusCode: 500,
      duration,
      source: 'server',
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Return error response
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Example of using the middleware helper for cleaner code
 */
import { withApiMetrics } from '../middleware-example';

export async function POST(req: NextRequest) {
  return withApiMetrics(req, async () => {
    // Your API logic here
    const requestData = await req.json();
    
    // Process the request...
    console.log('Processing request:', requestData);
    
    return NextResponse.json({ success: true });
  });
}

