import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyArtists } from '@/lib/spotify';

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
  try {
    const artists = await searchSpotifyArtists(q);
    return NextResponse.json(artists);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
