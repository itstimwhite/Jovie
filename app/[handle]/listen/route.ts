import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { LISTEN_COOKIE } from '@/constants/app';
import { getAvailableDSPs, generateDSPButtonHTML } from '@/lib/dsp';
import { generateFooterHTML } from '@/lib/footer';
import { PAGE_SUBTITLES } from '@/constants/app';

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

  // Fetch releases for this specific artist
  const { data: releases } = await supabase
    .from('releases')
    .select('*')
    .eq('artist_id', artist.id)
    .order('release_date', { ascending: false });

  const availableDSPs = getAvailableDSPs(artist, releases || []);

  // If no DSPs available, show error
  if (availableDSPs.length === 0) {
    const footerHTML = generateFooterHTML({ artist, utmSource: 'listen' });

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>No Platforms Available - ${artist.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white min-h-screen flex flex-col items-center justify-center">
          <div class="text-center space-y-6 p-8">
            <h1 class="text-2xl font-bold text-gray-900">${artist.name}</h1>
            <p class="text-gray-600">No streaming platforms configured yet.</p>
            <p class="text-sm text-gray-500">Check back soon!</p>
          </div>
          ${footerHTML}
        </body>
      </html>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      }
    );
  }

  // Check for preference and redirect if valid
  if (preference) {
    const preferredDSP = availableDSPs.find((dsp) => dsp.key === preference);
    if (preferredDSP) {
      return NextResponse.redirect(preferredDSP.url);
    }
  }

  // Generate HTML with all available DSPs
  const dspButtonsHTML = availableDSPs.map(generateDSPButtonHTML).join('');

  // Generate footer HTML
  const footerHTML = generateFooterHTML({ artist, utmSource: 'listen' });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listen to ${artist.name}</title>
        <meta name="description" content="Choose your preferred streaming platform to listen to ${artist.name}">
        <meta name="robots" content="noindex, nofollow">
        <link rel="preconnect" href="https://cdn.tailwindcss.com">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .platform-button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        </style>
      </head>
      <body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div class="text-center space-y-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">${artist.name}</h1>
              <p class="text-gray-600 mt-2">${PAGE_SUBTITLES.listen}</p>
            </div>
            
            <div class="space-y-3">
              ${dspButtonsHTML}
            </div>

            <div class="text-xs text-gray-500 space-y-1">
              <p>Your preference will be saved for next time</p>
            </div>
          </div>
        </div>

        ${footerHTML}

        <script>
          // Add click tracking and preference saving
          document.querySelectorAll('[data-dsp]').forEach(button => {
            button.addEventListener('click', async (e) => {
              e.preventDefault();
              const dsp = button.dataset.dsp;
              const url = button.dataset.url;
              
              if (!dsp || !url) return;
              
              // Save preference
              document.cookie = \`${LISTEN_COOKIE}=\${dsp}; path=/; max-age=\${60 * 60 * 24 * 365}; SameSite=Lax\`;
              localStorage.setItem('${LISTEN_COOKIE}', dsp);
              
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
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  });
}
