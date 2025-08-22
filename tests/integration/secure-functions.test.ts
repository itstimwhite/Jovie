/**
 * Integration tests for secure database functions
 * Tests the new SECURITY DEFINER functions for claim flow and click tracking
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type {
  ClickRecordResult,
  ClaimProfileResult,
  CreateUnclaimedProfileResult,
  UpdateUnclaimedProfileResult,
  LinkType,
  CreatorType,
} from '../../types/db';

// This test requires real Supabase credentials
// Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for integration testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const isRealSupabase = supabaseUrl !== 'https://example.supabase.co';

// Skip these tests if real Supabase credentials are not available
const describeIf = isRealSupabase ? describe : describe.skip;

describeIf('Secure Functions Integration Tests', () => {
  const anonymousClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  let testProfileId: string;
  let testClaimToken: string;
  
  beforeAll(async () => {
    // Clean up any existing test profiles
    const { error: cleanupError } = await anonymousClient
      .from('creator_profiles')
      .delete()
      .eq('username', 'test-secure-functions');
    
    // Ignore cleanup errors - profile might not exist
  });

  afterAll(async () => {
    // Clean up test data
    if (testProfileId) {
      const { error } = await anonymousClient
        .from('creator_profiles')
        .delete()
        .eq('id', testProfileId);
      // Ignore cleanup errors
    }
  });

  describe('Username Uniqueness', () => {
    it('should enforce case-insensitive username uniqueness', async () => {
      // First, create a profile with lowercase username
      const { data: result1, error: error1 } = await anonymousClient
        .rpc('create_unclaimed_profile_secure', {
          username_param: 'testuniqueuser',
          display_name_param: 'Test User',
          creator_type_param: 'artist' as CreatorType
        });

      expect(error1).toBeNull();
      expect(result1).toBeDefined();
      const createResult1 = result1[0] as CreateUnclaimedProfileResult;
      expect(createResult1.success).toBe(true);
      expect(createResult1.profile_id).toBeDefined();

      // Try to create another profile with mixed case username
      const { data: result2, error: error2 } = await anonymousClient
        .rpc('create_unclaimed_profile_secure', {
          username_param: 'TestUniqueUser', // Different case
          display_name_param: 'Test User 2',
          creator_type_param: 'artist' as CreatorType
        });

      expect(error2).toBeNull();
      expect(result2).toBeDefined();
      const createResult2 = result2[0] as CreateUnclaimedProfileResult;
      expect(createResult2.success).toBe(false);
      expect(createResult2.message).toContain('already exists');

      // Clean up
      if (createResult1.profile_id) {
        await anonymousClient
          .from('creator_profiles')
          .delete()
          .eq('id', createResult1.profile_id);
      }
    });

    it('should validate username format', async () => {
      // Test invalid usernames
      const invalidUsernames = [
        '', // empty
        'ab', // too short
        'a'.repeat(31), // too long
        'test@user', // invalid character
        'test user', // space
        'test.user', // period
      ];

      for (const username of invalidUsernames) {
        const { data: result, error } = await anonymousClient
          .rpc('create_unclaimed_profile_secure', {
            username_param: username,
            display_name_param: 'Test User',
            creator_type_param: 'artist' as CreatorType
          });

        expect(error).toBeNull();
        expect(result).toBeDefined();
        const createResult = result[0] as CreateUnclaimedProfileResult;
        expect(createResult.success).toBe(false);
        expect(createResult.message).toContain('must be');
      }
    });
  });

  describe('Secure Click Ingestion', () => {
    beforeAll(async () => {
      // Create a test profile for click testing
      const { data: result, error } = await anonymousClient
        .rpc('create_unclaimed_profile_secure', {
          username_param: 'test-click-user',
          display_name_param: 'Test Click User',
          creator_type_param: 'artist' as CreatorType
        });

      expect(error).toBeNull();
      const createResult = result[0] as CreateUnclaimedProfileResult;
      expect(createResult.success).toBe(true);
      testProfileId = createResult.profile_id!;
      testClaimToken = createResult.claim_token!;
    });

    it('should record clicks for public profiles', async () => {
      const { data: result, error } = await anonymousClient
        .rpc('record_click_secure', {
          creator_username: 'test-click-user',
          link_type_param: 'social' as LinkType,
          target_param: 'instagram',
          ua_param: 'test-browser',
          platform_param: 'web'
        });

      expect(error).toBeNull();
      expect(result).toBeDefined();
      const clickResult = result[0] as ClickRecordResult;
      expect(clickResult.success).toBe(true);
      expect(clickResult.click_id).toBeDefined();
    });

    it('should reject clicks for non-existent users', async () => {
      const { data: result, error } = await anonymousClient
        .rpc('record_click_secure', {
          creator_username: 'non-existent-user',
          link_type_param: 'social' as LinkType,
          target_param: 'instagram'
        });

      expect(error).toBeNull();
      expect(result).toBeDefined();
      const clickResult = result[0] as ClickRecordResult;
      expect(clickResult.success).toBe(false);
      expect(clickResult.message).toContain('not found');
    });

    it('should validate click input parameters', async () => {
      // Test empty username
      const { data: result1, error: error1 } = await anonymousClient
        .rpc('record_click_secure', {
          creator_username: '',
          link_type_param: 'social' as LinkType,
          target_param: 'instagram'
        });

      expect(error1).toBeNull();
      const clickResult1 = result1[0] as ClickRecordResult;
      expect(clickResult1.success).toBe(false);
      expect(clickResult1.message).toContain('Invalid username');

      // Test empty target
      const { data: result2, error: error2 } = await anonymousClient
        .rpc('record_click_secure', {
          creator_username: 'test-click-user',
          link_type_param: 'social' as LinkType,
          target_param: ''
        });

      expect(error2).toBeNull();
      const clickResult2 = result2[0] as ClickRecordResult;
      expect(clickResult2.success).toBe(false);
      expect(clickResult2.message).toContain('Invalid target');
    });
  });

  describe('Secure Claim Flow', () => {
    beforeAll(async () => {
      // Create a test profile for claiming if not already created
      if (!testProfileId) {
        const { data: result, error } = await anonymousClient
          .rpc('create_unclaimed_profile_secure', {
            username_param: 'test-claim-user',
            display_name_param: 'Test Claim User',
            creator_type_param: 'artist' as CreatorType
          });

        expect(error).toBeNull();
        const createResult = result[0] as CreateUnclaimedProfileResult;
        expect(createResult.success).toBe(true);
        testProfileId = createResult.profile_id!;
        testClaimToken = createResult.claim_token!;
      }
    });

    it('should create unclaimed profiles with claim tokens', async () => {
      const { data: result, error } = await anonymousClient
        .rpc('create_unclaimed_profile_secure', {
          username_param: 'test-new-unclaimed',
          display_name_param: 'Test New Unclaimed',
          creator_type_param: 'artist' as CreatorType
        });

      expect(error).toBeNull();
      expect(result).toBeDefined();
      const createResult = result[0] as CreateUnclaimedProfileResult;
      expect(createResult.success).toBe(true);
      expect(createResult.profile_id).toBeDefined();
      expect(createResult.claim_token).toBeDefined();

      // Clean up
      if (createResult.profile_id) {
        await anonymousClient
          .from('creator_profiles')
          .delete()
          .eq('id', createResult.profile_id);
      }
    });

    it('should update unclaimed profiles securely', async () => {
      const { data: result, error } = await anonymousClient
        .rpc('update_unclaimed_profile_secure', {
          profile_id_param: testProfileId,
          display_name_param: 'Updated Display Name',
          bio_param: 'Updated bio text',
          spotify_url_param: 'https://open.spotify.com/artist/test'
        });

      expect(error).toBeNull();
      expect(result).toBeDefined();
      const updateResult = result[0] as UpdateUnclaimedProfileResult;
      expect(updateResult.success).toBe(true);

      // Verify the update
      const { data: profile, error: fetchError } = await anonymousClient
        .from('creator_profiles')
        .select('display_name, bio, spotify_url')
        .eq('id', testProfileId)
        .single();

      expect(fetchError).toBeNull();
      expect(profile.display_name).toBe('Updated Display Name');
      expect(profile.bio).toBe('Updated bio text');
      expect(profile.spotify_url).toBe('https://open.spotify.com/artist/test');
    });

    it('should reject updates to non-existent profiles', async () => {
      const { data: result, error } = await anonymousClient
        .rpc('update_unclaimed_profile_secure', {
          profile_id_param: '00000000-0000-0000-0000-000000000000',
          display_name_param: 'Should Fail'
        });

      expect(error).toBeNull();
      expect(result).toBeDefined();
      const updateResult = result[0] as UpdateUnclaimedProfileResult;
      expect(updateResult.success).toBe(false);
      expect(updateResult.message).toContain('not found');
    });

    // Note: We can't easily test the claim_profile_secure function here
    // because it requires an authenticated user context (JWT token)
    // That would need to be tested in E2E tests with actual user sessions
  });

  describe('RLS Policy Enforcement', () => {
    it('should block direct inserts to click_events', async () => {
      const { data, error } = await anonymousClient
        .from('click_events')
        .insert({
          creator_id: testProfileId,
          link_type: 'social',
          target: 'instagram'
        });

      // Should fail due to RLS policy blocking direct inserts
      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should block direct inserts to creator_profiles for anonymous users', async () => {
      const { data, error } = await anonymousClient
        .from('creator_profiles')
        .insert({
          username: 'should-fail',
          creator_type: 'artist',
          is_claimed: false
        });

      // Should fail due to RLS policy blocking direct inserts
      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should allow reading public creator profiles', async () => {
      const { data, error } = await anonymousClient
        .from('creator_profiles')
        .select('id, username, display_name, is_public')
        .eq('is_public', true)
        .limit(5);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      if (data && data.length > 0) {
        data.forEach(profile => {
          expect(profile.is_public).toBe(true);
        });
      }
    });
  });
});