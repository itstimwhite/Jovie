import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyArtists } from '@/lib/spotify';

// API routes should be dynamic
export const dynamic = 'force-dynamic';

// Simple in-memory cache for API responses
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/spotify/search?q={query}
 * Returns a JSON list of Spotify artists matching the query.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json([], { status: 400 });
  }

  // Check cache first
  const cacheKey = q.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const artists = await searchSpotifyArtists(q);

    // Cache the results
    searchCache.set(cacheKey, {
      data: artists,
      timestamp: Date.now(),
    });

    // Clean up old cache entries (keep only last 100 entries)
    if (searchCache.size > 100) {
      const entries = Array.from(searchCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const toDelete = entries.slice(100);
      toDelete.forEach(([key]) => searchCache.delete(key));
    }

    return NextResponse.json(artists);
  } catch (err) {
    console.error('Spotify search error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Search failed' },
      { status: 500 }
    );
  }
}
