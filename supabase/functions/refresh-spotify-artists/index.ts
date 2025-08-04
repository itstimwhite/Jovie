// @ts-nocheck
/* eslint-disable */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface Artist {
  id: string;
  handle: string;
  spotify_id: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID');
const spotifyClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

const supabase = createClient(supabaseUrl ?? '', supabaseServiceKey ?? '');

async function getSpotifyToken(): Promise<string> {
  const authHeader =
    'Basic ' + btoa(`${spotifyClientId}:${spotifyClientSecret}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

async function getSpotifyArtist(artistId: string, token: string): Promise<any> {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch artist from Spotify: ${response.status}`);
  }
  return response.json();
}

async function getArtistLatestRelease(
  artistId: string,
  token: string
): Promise<any | null> {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=1&market=US`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch albums from Spotify: ${response.status}`);
  }
  const data = await response.json();
  return data.items?.[0] ?? null;
}

async function updateArtist(artist: Artist, token: string) {
  const spotifyData = await getSpotifyArtist(artist.spotify_id, token);
  const latestRelease = await getArtistLatestRelease(artist.spotify_id, token);
  const { error } = await supabase
    .from('artists')
    .update({
      image_url: spotifyData.images?.[0]?.url ?? null,
      tagline: latestRelease
        ? `${latestRelease.name} - ${latestRelease.album_type}`
        : spotifyData.name,
    })
    .eq('id', artist.id);
  if (error) {
    throw new Error(error.message);
  }
}

Deno.serve(async () => {
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, handle, spotify_id')
    .eq('published', true);

  if (error) {
    const message = `Database error: ${error.message}`;
    console.error(message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }

  const token = await getSpotifyToken();

  const batchSize = 10;
  let success = 0;
  const failures: { id: string; error: string }[] = [];

  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (artist) => {
        try {
          await updateArtist(artist, token);
          success += 1;
        } catch (err) {
          failures.push({ id: artist.id, error: err.message });
        }
      })
    );
    if (i + batchSize < artists.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const result = {
    processed: artists.length,
    succeeded: success,
    failed: failures.length,
    failures,
  };

  console.log('Artist refresh summary', result);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
