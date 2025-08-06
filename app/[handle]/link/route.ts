import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getAvailableDSPs, generateDSPButtonHTML } from '@/lib/dsp';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  const supabase = await createServerClient();

  if (!supabase) {
    return new NextResponse('Database connection failed', { status: 500 });
  }

  // Fetch artist data
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (artistError || !artist) {
    return new NextResponse('Artist not found', { status: 404 });
  }

  // Now fetch releases for this specific artist
  const { data: releases } = await supabase
    .from('releases')
    .select('*')
    .eq('artist_id', artist.id)
    .order('release_date', { ascending: false });

  const availableDSPs = getAvailableDSPs(artist, releases || []);

  // If no DSPs available, redirect to main profile
  if (availableDSPs.length === 0) {
    return NextResponse.redirect(new URL(`/${handle}`, request.url));
  }

  // AUTO-REDIRECT LOGIC: If only one DSP is available, redirect directly
  if (availableDSPs.length === 1) {
    const singleDSP = availableDSPs[0];

    // Track the auto-redirect (fire and forget)
    try {
      await fetch(new URL('/api/track', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          linkType: 'listen',
          target: singleDSP.key,
        }),
      });
    } catch {
      // Ignore tracking errors
    }

    return NextResponse.redirect(singleDSP.url);
  }

  // Multiple DSPs available - show selection page
  const dspButtonsHTML = availableDSPs.map(generateDSPButtonHTML).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listen to ${artist.name}</title>
        <meta name="description" content="Listen to ${artist.name} on your preferred streaming platform">
        <meta name="robots" content="noindex, nofollow">
        <link rel="preconnect" href="https://cdn.tailwindcss.com">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .platform-button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        </style>
      </head>
      <body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div class="text-center space-y-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">${artist.name}</h1>
              <p class="text-gray-600 mt-2">Choose your streaming platform</p>
            </div>
            
            <div class="space-y-3">
              ${dspButtonsHTML}
            </div>

            <div class="text-xs text-gray-500 space-y-1">
              <p>Links will open in a new tab</p>
              <p>Powered by <a href="https://jovie.co" class="text-blue-600 hover:underline">Jovie</a></p>
            </div>
          </div>
        </div>

        <script>
          // Add click tracking for analytics
          document.querySelectorAll('[data-dsp]').forEach(button => {
            button.addEventListener('click', async (e) => {
              e.preventDefault();
              const dsp = button.dataset.dsp;
              const url = button.dataset.url;
              
              if (!dsp || !url) return;
              
              // Track click (fire and forget)
              fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  handle: '${handle}',
                  linkType: 'listen',
                  target: dsp,
                }),
              }).catch(() => {}); // Ignore tracking errors
              
              // Open link
              window.open(url, '_blank', 'noopener,noreferrer');
            });
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=60, s-maxage=60', // Shorter cache for link route
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  });
}
