import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Type for API route handler
type ApiRouteHandler = (
  req: NextRequest,
  params: any
) => Promise<NextResponse>;

/**
 * Guard an API route with authentication
 * Returns 401 with SESSION_EXPIRED error if not authenticated
 * 
 * @param handler The API route handler function
 * @returns Guarded API route handler
 */
export function withAuthGuard(handler: ApiRouteHandler): ApiRouteHandler {
  return async (req: NextRequest, params: any) => {
    try {
      // Check authentication
      const { userId } = await auth();
      
      if (!userId) {
        // Return standardized 401 response for expired sessions
        return NextResponse.json(
          { error: 'SESSION_EXPIRED', message: 'Your session has expired' },
          { status: 401 }
        );
      }
      
      // Authentication successful, proceed with handler
      return handler(req, params);
    } catch (error) {
      console.error('API auth error:', error);
      
      // Return standardized 401 response for auth errors
      return NextResponse.json(
        { error: 'SESSION_EXPIRED', message: 'Authentication error' },
        { status: 401 }
      );
    }
  };
}

/**
 * Check if a request is authenticated
 * For use within API route handlers
 * 
 * @returns Object with userId and isAuthenticated flag
 */
export async function checkApiAuth() {
  try {
    const { userId } = await auth();
    return { 
      userId, 
      isAuthenticated: Boolean(userId) 
    };
  } catch (error) {
    console.error('API auth check error:', error);
    return { 
      userId: null, 
      isAuthenticated: false 
    };
  }
}

/**
 * Create a standardized auth error response
 * 
 * @param message Optional custom error message
 * @returns NextResponse with 401 status and SESSION_EXPIRED error
 */
export function createAuthErrorResponse(message?: string): NextResponse {
  return NextResponse.json(
    { 
      error: 'SESSION_EXPIRED', 
      message: message || 'Your session has expired' 
    },
    { status: 401 }
  );
}

