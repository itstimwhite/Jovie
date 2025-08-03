import { SpotifyArtist, SpotifyAlbum } from '@/types/common';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Token cache
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status}`);
    }

    const data = await response.json();

    // Cache the token with expiration (subtract 60 seconds for safety)
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error('Spotify token error:', error);
    throw new Error('Failed to authenticate with Spotify');
  }
}

export async function getSpotifyArtist(
  artistId: string
): Promise<SpotifyArtist> {
  const token = await getSpotifyToken();

  const response = await fetch(`${SPOTIFY_API_BASE}/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch artist from Spotify: ${response.status}`);
  }

  return response.json();
}

export async function getArtistLatestRelease(
  artistId: string
): Promise<SpotifyAlbum | null> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/artists/${artistId}/albums?include_groups=album,single&limit=50&market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch albums from Spotify: ${response.status}`);
  }

  const data = await response.json();
  const albums = data.items as SpotifyAlbum[];

  if (albums.length === 0) {
    return null;
  }

  const sortedAlbums = albums.sort((a, b) => {
    return (
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  });

  return sortedAlbums[0];
}

/**
 * Search Spotify for artists matching a query string.
 * Returns up to 10 matching artists.
 */
export async function searchSpotifyArtists(
  query: string
): Promise<SpotifyArtist[]> {
  const token = await getSpotifyToken();
  const uri = new URL(`${SPOTIFY_API_BASE}/search`);
  uri.searchParams.set('q', query);
  uri.searchParams.set('type', 'artist');
  uri.searchParams.set('limit', '10');

  try {
    const response = await fetch(uri.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status}`);
    }

    const data = await response.json();
    return (data.artists?.items as SpotifyArtist[]) || [];
  } catch (error) {
    console.error('Spotify search error:', error);
    throw new Error('Failed to search artists on Spotify');
  }
}

export function buildSpotifyArtistUrl(artistId: string): string {
  return `https://open.spotify.com/artist/${artistId}`;
}

export function buildSpotifyAlbumUrl(albumId: string): string {
  return `https://open.spotify.com/album/${albumId}`;
}
