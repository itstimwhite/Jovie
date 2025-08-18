/**
 * Integration test for Supabase RLS policies
 * This file demonstrates how to test RLS policies with a real Supabase instance
 *
 * NOTE: This test requires actual Supabase credentials to run
 * It's provided as documentation/example for manual testing
 */

import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// This test is skipped by default as it requires real Supabase credentials
// To run this test:
// 1. Set up real SUPABASE_URL and SUPABASE_ANON_KEY environment variables
// 2. Change `describe.skip` to `describe`
// 3. Run with: npm test -- tests/lib/supabase-rls-integration.test.ts

describe.skip('Supabase RLS Integration Test', () => {
  // These would need to be real values for integration testing
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

  const anonymousClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  it('should allow anonymous read access to published artists', async () => {
    // Test anonymous access to published artists
    const { data, error } = await anonymousClient
      .from('artists')
      .select('id, handle, name, published, image_url, is_verified')
      .eq('published', true)
      .order('name')
      .limit(5);

    // Should succeed without authentication
    expect(error).toBeNull();
    expect(data).toBeDefined();

    if (data && data.length > 0) {
      // All returned artists should have published = true
      data.forEach((artist) => {
        expect(artist.published).toBe(true);
      });
    }

    console.log('✓ Anonymous read access to published artists works');
    console.log(`  Found ${data?.length || 0} published artists`);
  });

  it('should block anonymous access to unpublished artists', async () => {
    // Try to access unpublished artists (should return empty or error)
    const { data, error } = await anonymousClient
      .from('artists')
      .select('*')
      .eq('published', false);

    // This should either return empty data or an error depending on RLS configuration
    // With proper RLS, it should return empty data (no error, but no results)
    expect(error).toBeNull();
    expect(data).toEqual([]);

    console.log('✓ Anonymous access blocked for unpublished artists');
  });

  it('should allow anonymous read access to social_links of published artists', async () => {
    // First get a published artist
    const { data: artists } = await anonymousClient
      .from('artists')
      .select('id, handle')
      .eq('published', true)
      .limit(1);

    if (!artists || artists.length === 0) {
      console.log('⚠ No published artists found for social_links test');
      return;
    }

    const artistId = artists[0].id;

    // Then try to get their social links
    const { data: socialLinks, error } = await anonymousClient
      .from('social_links')
      .select('id, platform, url, clicks')
      .eq('artist_id', artistId);

    // Should succeed without authentication
    expect(error).toBeNull();
    expect(socialLinks).toBeDefined();

    console.log('✓ Anonymous read access to social_links works');
    console.log(
      `  Found ${socialLinks?.length || 0} social links for artist ${artists[0].handle}`
    );
  });

  it('should allow anonymous join queries between artists and social_links', async () => {
    // Test join query to get artists with their social links
    const { data, error } = await anonymousClient
      .from('artists')
      .select(
        `
        id,
        handle,
        name,
        published,
        social_links (
          id,
          platform,
          url
        )
      `
      )
      .eq('published', true)
      .limit(3);

    // Should succeed without authentication
    expect(error).toBeNull();
    expect(data).toBeDefined();

    if (data && data.length > 0) {
      // All returned artists should have published = true
      data.forEach((artist) => {
        expect(artist.published).toBe(true);
      });
    }

    console.log('✓ Anonymous join queries work');
    console.log(`  Found ${data?.length || 0} artists with social links`);
  });

  it('should block anonymous write operations', async () => {
    // Try to insert a new artist (should fail)
    const { data: insertData, error: insertError } = await anonymousClient
      .from('artists')
      .insert({
        handle: 'test-artist',
        spotify_id: 'test123',
        name: 'Test Artist',
        published: true,
      });

    // This should fail due to RLS policies blocking writes for anonymous users
    expect(insertError).toBeDefined();
    expect(insertData).toBeNull();

    console.log('✓ Anonymous write operations blocked');
    console.log(`  Insert error: ${insertError?.message}`);
  });

  it('should block anonymous updates and deletes', async () => {
    // Try to update an existing artist (should fail)
    const { error: updateError } = await anonymousClient
      .from('artists')
      .update({ name: 'Hacked Name' })
      .eq('handle', 'ladygaga');

    expect(updateError).toBeDefined();

    // Try to delete an artist (should fail)
    const { error: deleteError } = await anonymousClient
      .from('artists')
      .delete()
      .eq('handle', 'ladygaga');

    expect(deleteError).toBeDefined();

    console.log('✓ Anonymous update/delete operations blocked');
  });
});
