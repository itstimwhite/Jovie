import { createAnonymousServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// In-memory cache for mock responses to reduce server load during testing
// Cache expires after 10 seconds to balance performance with realistic behavior
const mockResponseCache = new Map<string, { result: any; expiry: number }>();
const MOCK_CACHE_TTL = 10 * 1000; // 10 seconds

// Helper function to get cached mock response
function getCachedMockResponse(handle: string) {
  const cached = mockResponseCache.get(handle);
  if (cached && cached.expiry > Date.now()) {
    return cached.result;
  }
  return null;
}

// Helper function to cache mock response
function cacheMockResponse(handle: string, result: any) {
  mockResponseCache.set(handle, {
    result,
    expiry: Date.now() + MOCK_CACHE_TTL,
  });
}

// Helper function to create mock response with appropriate cache headers
function createMockResponse(handle: string) {
  // Check cache first
  const cachedResponse = getCachedMockResponse(handle);
  if (cachedResponse) {
    return NextResponse.json(cachedResponse, {
      headers: {
        'Cache-Control': `public, max-age=10`, // 10 second cache for mock responses
        'X-Mock-Response': 'true',
        'X-Cache-Status': 'hit',
      },
    });
  }

  // Mock some common handles as taken for realistic testing
  const commonHandles = [
    'admin',
    'root',
    'test',
    'user',
    'api',
    'www',
    'mail',
    'ftp',
    'support',
  ];
  const isCommonHandle = commonHandles.includes(handle.toLowerCase());
  const result = { available: !isCommonHandle };

  // Cache the result
  cacheMockResponse(handle, result);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': `public, max-age=10`, // 10 second cache for mock responses
      'X-Mock-Response': 'true',
      'X-Cache-Status': 'miss',
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { available: false, error: 'Handle is required' },
      { status: 400 }
    );
  }

  // Validate handle format
  if (handle.length < 3) {
    return NextResponse.json(
      { available: false, error: 'Handle must be at least 3 characters' },
      { status: 400 }
    );
  }

  if (handle.length > 30) {
    return NextResponse.json(
      { available: false, error: 'Handle must be less than 30 characters' },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9-]+$/.test(handle)) {
    return NextResponse.json(
      {
        available: false,
        error: 'Handle can only contain letters, numbers, and hyphens',
      },
      { status: 400 }
    );
  }

  try {
    // Use anonymous client since handle checking doesn't require authentication
    const supabase = createAnonymousServerClient();

    if (!supabase) {
      return NextResponse.json(
        { available: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const handleLower = handle.toLowerCase();

    // Add timeout to prevent hanging on database issues
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 3000); // 3 second timeout
    });

    const { data, error } = await Promise.race([
      supabase
        .from('creator_profiles')
        .select('username')
        .eq('username', handleLower),
      timeoutPromise,
    ]);

    if (error) {
      console.error('Error checking handle availability:', error);

      // For testing: if database schema is incomplete, provide mock availability response
      if (
        error.code === 'PGRST204' ||
        error.code === '42P01' ||
        error.code === '42703'
      ) {
        console.log(
          'Database schema incomplete, providing cached mock handle availability for testing'
        );

        return createMockResponse(handleLower);
      }

      return NextResponse.json(
        { available: false, error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { available: !data || data.length === 0 },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error checking handle availability:', error);

    // Handle timeout and provide mock response
    if (
      (error as Error)?.message?.includes('timeout') ||
      (error as Error)?.message?.includes('Database timeout')
    ) {
      console.log(
        'Database timeout, providing cached mock handle availability for testing'
      );

      return createMockResponse(handle.toLowerCase());
    }

    return NextResponse.json(
      { available: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
