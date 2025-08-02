import { SpotifyArtist, SpotifyAlbum } from '@/types/common';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  return data.access_token;
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
    throw new Error('Failed to fetch artist from Spotify');
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
    throw new Error('Failed to fetch albums from Spotify');
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

export function buildSpotifyArtistUrl(artistId: string): string {
  return `https://open.spotify.com/artist/${artistId}`;
}

export function buildSpotifyAlbumUrl(albumId: string): string {
  return `https://open.spotify.com/album/${albumId}`;
}
