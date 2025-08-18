import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createServerClient() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // For local development, ensure we use localhost instead of 127.0.0.1 for server-side requests
  const serverSupabaseUrl =
    process.env.NODE_ENV === 'development'
      ? supabaseUrl.replace('127.0.0.1', 'localhost')
      : supabaseUrl;

  return createClient(serverSupabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Prevent multiple auth instances
    },
    global: {
      // Add custom fetch for local development to handle networking issues
      fetch:
        process.env.NODE_ENV === 'development'
          ? createLocalDevFetch()
          : undefined,
    },
    async accessToken() {
      try {
        const { getToken } = await auth();
        // Use native integration instead of deprecated JWT template
        return (await getToken()) ?? null;
      } catch {
        return null;
      }
    },
  });
}

// Custom fetch function for local development that handles networking issues
function createLocalDevFetch() {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();

    try {
      // First try the normal fetch
      return await fetch(input, init);
    } catch (error) {
      // If fetch fails and we're in local dev, try with 127.0.0.1 instead of localhost
      if (process.env.NODE_ENV === 'development') {
        const fallbackUrl = url.replace('localhost:54321', '127.0.0.1:54321');
        try {
          return await fetch(fallbackUrl, init);
        } catch {
          // If both fail, return a mock response for development
          console.warn(
            'Local Supabase fetch failed, using development fallback:',
            error
          );
          return createMockResponse(url);
        }
      }
      throw error;
    }
  };
}

// Create a mock response for local development when Supabase is unreachable
function createMockResponse(url: string): Response {
  // For artist queries, return mock data
  if (url.includes('/rest/v1/artists')) {
    const mockArtists = [
      {
        id: '4bfd003a-5baa-4dac-a491-a7fac11607ac',
        handle: 'ladygaga',
        name: 'Lady Gaga',
        tagline: 'Born This Way',
        image_url:
          'https://i.scdn.co/image/ab6761610000e5eb5f3f7f0d20e84c6e1d1b5c73',
        is_verified: true,
        published: true,
        social_links: [],
      },
    ];

    const response = JSON.stringify(mockArtists);
    return new Response(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For other queries, return empty array
  return new Response('[]', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Server-side function to get authenticated Supabase client using native integration
export async function createAuthenticatedServerClient() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    // For local development, ensure we use localhost instead of 127.0.0.1 for server-side requests
    const serverSupabaseUrl =
      process.env.NODE_ENV === 'development'
        ? supabaseUrl.replace('127.0.0.1', 'localhost')
        : supabaseUrl;

    return createClient(serverSupabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      global: {
        // Add custom fetch for local development to handle networking issues
        fetch:
          process.env.NODE_ENV === 'development'
            ? createLocalDevFetch()
            : undefined,
      },
      async accessToken() {
        // For server-side, we need to get the token from the session
        try {
          const { getToken } = await auth();
          // Use native integration instead of deprecated JWT template
          return (await getToken()) ?? null;
        } catch {
          return null;
        }
      },
    });
  } catch {
    // Fall back to anonymous client
    if (!supabaseUrl || !supabaseKey) {
      return null;
    }
    // For local development, ensure we use localhost instead of 127.0.0.1 for server-side requests
    const serverSupabaseUrl =
      process.env.NODE_ENV === 'development'
        ? supabaseUrl.replace('127.0.0.1', 'localhost')
        : supabaseUrl;

    return createClient(serverSupabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Prevent multiple auth instances
      },
      global: {
        // Add custom fetch for local development to handle networking issues
        fetch:
          process.env.NODE_ENV === 'development'
            ? createLocalDevFetch()
            : undefined,
      },
    });
  }
}

// Alias for backward compatibility
export async function getAuthenticatedServerClient() {
  return createAuthenticatedServerClient();
}

// Helper function to get user ID from Clerk session
export async function getClerkUserId() {
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}
