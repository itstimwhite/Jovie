import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { buildSpotifyArtistUrl } from '@/lib/spotify';
import { LISTEN_COOKIE } from '@/constants/app';
import { Artist, Release } from '@/types/db';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const cookieStore = await cookies();
  const preference = cookieStore.get(LISTEN_COOKIE)?.value;

  const supabase = await createServerClient();

  if (!supabase) {
    return new NextResponse('Database connection failed', { status: 500 });
  }

  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (artistError || !artist) {
    return new NextResponse('Artist not found', { status: 404 });
  }

  const artistData = artist as Artist;

  if (preference === 'spotify') {
    const { data: release } = await supabase
      .from('releases')
      .select('*')
      .eq('artist_id', artistData.id)
      .eq('dsp', 'spotify')
      .order('release_date', { ascending: false })
      .limit(1)
      .single();

    const releaseData = release as Release | null;
    const redirectUrl = releaseData
      ? releaseData.url
      : buildSpotifyArtistUrl(artistData.spotify_id);

    return NextResponse.redirect(redirectUrl);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Choose Platform - ${artistData.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-white min-h-screen flex items-center justify-center">
        <div class="text-center space-y-6 p-8">
          <h1 class="text-2xl font-bold">Listen to ${artistData.name}</h1>
          <p class="text-gray-600">Choose your preferred streaming platform</p>
          
          <button
            id="spotify-btn"
            class="w-full max-w-xs mx-auto bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Open in Spotify
          </button>
        </div>

        <script>
          document.getElementById('spotify-btn').addEventListener('click', async () => {
            // Set cookie and localStorage
            document.cookie = '${LISTEN_COOKIE}=spotify; path=/; max-age=${60 * 60 * 24 * 365}';
            localStorage.setItem('${LISTEN_COOKIE}', 'spotify');
            
            // Redirect
            window.location.href = '/${handle}/listen';
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
