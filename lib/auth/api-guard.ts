import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Type for API route handler
type RouteHandler = (
  req: NextRequest,
  context: { userId: string }
) => Promise<NextResponse>;

/**
 * Higher-order function to protect API routes with authentication
 * Returns 401 with SESSION_EXPIRED error if not authenticated
 * 
 * @param handler The API route handler function
 * @returns Protected handler function
 */
export function withAuthGuard(handler: RouteHandler) {
  return async (req: NextRequest) => {
    try {
      // Get authentication context from Clerk
      const { userId } = await auth();
      
      // If not authenticated, return 401 with SESSION_EXPIRED error
      if (!userId) {
        return NextResponse.json(
          { error: 'SESSION_EXPIRED', message: 'Your session has expired' },
          { status: 401 }
        );
      }
      
      // Call the handler with the authenticated user ID
      return handler(req, { userId });
    } catch (error) {
      console.error('Error in API auth guard:', error);
      
      // Return 401 for auth errors, 500 for other errors
      if (error instanceof Error && error.message.includes('auth')) {
        return NextResponse.json(
          { error: 'SESSION_EXPIRED', message: 'Your session has expired' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

