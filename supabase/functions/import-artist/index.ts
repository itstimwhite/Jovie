import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import {
  getSpotifyArtist,
  getArtistLatestRelease,
  buildSpotifyAlbumUrl,
} from '../../../lib/spotify.ts';
import { generateHandle } from '../../../lib/utils.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { spotifyId, clerkId, email } = await req.json();
    if (!spotifyId || !clerkId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRole) {
      throw new Error('Supabase credentials not configured');
    }
    const supabase = createClient(supabaseUrl, serviceRole);

    // Get or create user
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    let userId;
    if (userError && userError.code === 'PGRST116') {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({ clerk_id: clerkId, email: email || '' })
        .select('id')
        .single();
      if (createUserError) throw createUserError;
      userId = newUser.id;
    } else if (userError) {
      throw userError;
    } else {
      userId = existingUser.id;
    }

    // Already claimed by this user?
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('handle')
      .eq('owner_user_id', userId)
      .eq('spotify_id', spotifyId)
      .single();
    if (existingArtist) {
      return new Response(
        JSON.stringify({ status: 'success', handle: existingArtist.handle }),
        { status: 200 }
      );
    }

    // Claimed by another?
    const { data: claimedByOther } = await supabase
      .from('artists')
      .select('id')
      .eq('spotify_id', spotifyId)
      .neq('owner_user_id', userId)
      .single();
    if (claimedByOther) {
      return new Response(JSON.stringify({ error: 'Artist already claimed' }), {
        status: 409,
      });
    }

    const spotifyArtist = await getSpotifyArtist(spotifyId);
    const baseHandle = generateHandle(spotifyArtist.name);

    const insertArtist = async (handle: string) =>
      supabase
        .from('artists')
        .insert({
          owner_user_id: userId,
          handle,
          spotify_id: spotifyId,
          name: spotifyArtist.name,
          image_url: spotifyArtist.images?.[0]?.url,
        })
        .select('*')
        .single();

    const { data: initialArtist, error: artistError } =
      await insertArtist(baseHandle);
    let artist = initialArtist;
    if (artistError && artistError.code === '23505') {
      let counter = 1;
      let finalArtist = null;
      while (!finalArtist && counter < 10) {
        const attempt = await insertArtist(`${baseHandle}${counter}`);
        if (!attempt.error) {
          finalArtist = attempt.data;
        } else if (attempt.error.code !== '23505') {
          throw attempt.error;
        }
        counter++;
      }
      if (!finalArtist) throw new Error('Could not generate unique handle');
      artist = finalArtist;
    } else if (artistError) {
      throw artistError;
    }

    // Insert latest release if available
    try {
      const latest = await getArtistLatestRelease(spotifyId);
      if (latest) {
        await supabase.from('releases').insert({
          artist_id: artist.id,
          dsp: 'spotify',
          title: latest.name,
          url: buildSpotifyAlbumUrl(latest.id),
          release_date: latest.release_date,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch latest release', err);
    }

    return new Response(
      JSON.stringify({ status: 'success', handle: artist.handle }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Import artist error', err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
});
