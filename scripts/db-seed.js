#!/usr/bin/env node
/*
  db-seed.js
  - Seeds minimal dataset for the preview branch only
  - Creates one creator profile, Venmo link, social/DSP links, and public artists
  - Idempotent: running multiple times will not duplicate data
*/

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Environment variables
const branch =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'local';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Use service key if available, otherwise use anon key
const apiKey = supabaseServiceKey || supabaseKey;

async function main() {
  console.log(`[db-seed] Detected branch: ${branch}`);

  if (branch !== 'preview' && branch !== 'local') {
    console.log(
      '[db-seed] Skipping: only seeds on preview branch or local development'
    );
    return; // exit 0
  }

  if (!supabaseUrl || !apiKey) {
    console.error('[db-seed] Error: Missing Supabase environment variables');
    console.error(
      '[db-seed] Required: NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY'
    );
    process.exit(1);
  }

  console.log('[db-seed] Initializing Supabase client...');
  const supabase = createClient(supabaseUrl, apiKey);

  try {
    console.log('[db-seed] Starting data seeding for preview environment...');

    // 1. Seed app_users
    console.log('[db-seed] Seeding app_users...');
    const { error: usersError } = await supabase.from('app_users').upsert(
      [
        {
          id: 'preview_user_1',
          email: 'preview_artist@example.com',
          is_pro: true,
        },
        {
          id: 'preview_user_2',
          email: 'preview_fan@example.com',
          is_pro: false,
        },
      ],
      { onConflict: 'id' }
    );

    if (usersError) {
      throw new Error(`Error seeding app_users: ${usersError.message}`);
    }

    // 2. Seed creator_profiles
    console.log('[db-seed] Seeding creator_profiles...');
    const { error: profilesError } = await supabase
      .from('creator_profiles')
      .upsert(
        [
          {
            user_id: 'preview_user_1',
            creator_type: 'artist',
            username: 'preview_artist',
            display_name: 'Preview Artist',
            bio: 'This is a preview artist profile for testing. This artist has a complete profile with social links and streaming platforms.',
            avatar_url: 'https://i.pravatar.cc/300?u=preview_artist',
            spotify_url: 'https://open.spotify.com/artist/preview123',
            apple_music_url:
              'https://music.apple.com/us/artist/preview-artist/123456789',
            youtube_url: 'https://youtube.com/@previewartist',
            spotify_id: 'preview123',
            is_public: true,
            is_verified: true,
            is_featured: true,
            settings: { hide_branding: false },
          },
          {
            user_id: null, // Unclaimed profile
            creator_type: 'artist',
            username: 'unclaimed_artist',
            display_name: 'Unclaimed Artist',
            bio: 'This is an unclaimed artist profile that can be claimed during testing.',
            avatar_url: 'https://i.pravatar.cc/300?u=unclaimed_artist',
            is_public: true,
            is_verified: false,
            is_claimed: false,
            claim_token: 'preview_claim_token',
            settings: { hide_branding: false },
          },
        ],
        { onConflict: 'username' }
      );

    if (profilesError) {
      throw new Error(
        `Error seeding creator_profiles: ${profilesError.message}`
      );
    }

    // Get the profile IDs for social links
    const { data: createdProfiles, error: fetchError } = await supabase
      .from('creator_profiles')
      .select('id, username')
      .in('username', ['preview_artist', 'unclaimed_artist']);

    if (fetchError) {
      throw new Error(`Error fetching created profiles: ${fetchError.message}`);
    }

    const previewArtistId = createdProfiles.find(
      (p) => p.username === 'preview_artist'
    )?.id;

    if (!previewArtistId) {
      throw new Error('Could not find preview_artist profile ID');
    }

    // 3. Seed social_links
    console.log('[db-seed] Seeding social_links...');
    const { error: socialLinksError } = await supabase
      .from('social_links')
      .upsert(
        [
          // Music streaming platforms
          {
            creator_profile_id: previewArtistId,
            platform: 'Spotify',
            platform_type: 'spotify',
            url: 'https://open.spotify.com/artist/preview123',
            sort_order: 1,
            is_active: true,
          },
          {
            creator_profile_id: previewArtistId,
            platform: 'Apple Music',
            platform_type: 'apple_music',
            url: 'https://music.apple.com/us/artist/preview-artist/123456789',
            sort_order: 2,
            is_active: true,
          },
          {
            creator_profile_id: previewArtistId,
            platform: 'YouTube Music',
            platform_type: 'youtube_music',
            url: 'https://music.youtube.com/channel/preview123',
            sort_order: 3,
            is_active: true,
          },
          // Social media
          {
            creator_profile_id: previewArtistId,
            platform: 'Instagram',
            platform_type: 'instagram',
            url: 'https://instagram.com/preview_artist',
            sort_order: 4,
            is_active: true,
          },
          {
            creator_profile_id: previewArtistId,
            platform: 'TikTok',
            platform_type: 'tiktok',
            url: 'https://tiktok.com/@preview_artist',
            sort_order: 5,
            is_active: true,
          },
          // Payment platform (Venmo)
          {
            creator_profile_id: previewArtistId,
            platform: 'Venmo',
            platform_type: 'venmo',
            url: 'https://venmo.com/preview_artist',
            display_text: 'Support on Venmo',
            sort_order: 6,
            is_active: true,
          },
        ],
        { onConflict: ['creator_profile_id', 'platform'] }
      );

    if (socialLinksError) {
      throw new Error(
        `Error seeding social_links: ${socialLinksError.message}`
      );
    }

    // 4. Seed releases
    console.log('[db-seed] Seeding releases...');
    const { error: releasesError } = await supabase.from('releases').upsert(
      [
        {
          creator_id: previewArtistId,
          dsp: 'Spotify',
          title: 'Preview Single',
          url: 'https://open.spotify.com/track/preview123',
          release_date: new Date().toISOString(),
        },
        {
          creator_id: previewArtistId,
          dsp: 'Apple Music',
          title: 'Preview Album',
          url: 'https://music.apple.com/us/album/preview-album/123456789',
          release_date: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days ago
        },
      ],
      { onConflict: ['creator_id', 'url'] }
    );

    if (releasesError) {
      throw new Error(`Error seeding releases: ${releasesError.message}`);
    }

    // 5. Verify seeding was successful
    console.log('[db-seed] Verifying seed data...');

    const { data: verifyProfiles, error: verifyError } = await supabase
      .from('creator_profiles')
      .select('username, display_name')
      .in('username', ['preview_artist', 'unclaimed_artist']);

    if (verifyError) {
      throw new Error(`Error verifying profiles: ${verifyError.message}`);
    }

    console.log(
      `[db-seed] Successfully seeded ${verifyProfiles.length} creator profiles:`
    );
    verifyProfiles.forEach((profile) => {
      console.log(`  - ${profile.display_name} (@${profile.username})`);
    });

    const { data: verifyLinks, error: verifyLinksError } = await supabase
      .from('social_links')
      .select('platform, platform_type, url')
      .eq('creator_profile_id', previewArtistId);

    if (verifyLinksError) {
      throw new Error(
        `Error verifying social links: ${verifyLinksError.message}`
      );
    }

    console.log(
      `[db-seed] Successfully seeded ${verifyLinks.length} social links for preview_artist`
    );

    console.log('[db-seed] Data seeding completed successfully! 🎉');
  } catch (error) {
    console.error('[db-seed] Error during seeding:', error.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[db-seed] Fatal error:', err);
  process.exit(1);
});
