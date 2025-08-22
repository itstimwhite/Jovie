import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Define the response shape
interface PerformanceResponse {
  metrics?: Record<string, any>[];
  error?: string;
}

/**
 * GET handler for performance metrics API
 * This endpoint is protected and only accessible to authenticated users
 */
export async function GET(
  req: NextRequest
): Promise<NextResponse<PerformanceResponse>> {
  try {
    // Check authentication
    const { userId } = await auth();

    // Only allow authenticated users
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, you would fetch metrics from your database or analytics service
    // For now, we'll return mock data
    const mockMetrics = [
      {
        name: 'lcp',
        value: 1250,
        rating: 'good',
        timestamp: Date.now() - 60000,
      },
      {
        name: 'fid',
        value: 45,
        rating: 'good',
        timestamp: Date.now() - 60000,
      },
      {
        name: 'cls',
        value: 0.05,
        rating: 'good',
        timestamp: Date.now() - 60000,
      },
      {
        name: 'fcp',
        value: 950,
        rating: 'good',
        timestamp: Date.now() - 60000,
      },
      {
        name: 'ttfb',
        value: 320,
        rating: 'good',
        timestamp: Date.now() - 60000,
      },
    ];

    return NextResponse.json({ metrics: mockMetrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}
