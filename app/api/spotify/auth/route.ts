import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/spotify/auth?artistId={artistId}
 * Redirects the user to Spotify OAuth to authorize and claim the selected artist.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const artistId = searchParams.get('artistId');
  if (!artistId) {
    return NextResponse.json(
      { error: 'artistId is required' },
      { status: 400 }
    );
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Spotify client ID not configured' },
      { status: 500 }
    );
  }
  // Redirect URI back to your application after Spotify auth
  const redirectUri = origin;
  const scopes = 'playlist-read-private user-read-email';
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', artistId);

  return NextResponse.redirect(authUrl.toString());
}
