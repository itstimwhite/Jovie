/**
 * Integration tests for username uniqueness enforcement
 * Tests the case-insensitive username uniqueness implementation
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { CreateUnclaimedProfileResult, CreatorType } from '../../types/db';

// This test requires real Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const isRealSupabase = supabaseUrl !== 'https://example.supabase.co';

// Skip these tests if real Supabase credentials are not available
const describeIf = isRealSupabase ? describe : describe.skip;

describeIf('Username Uniqueness Integration Tests', () => {
  const anonymousClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  const testUsernames = [
    'testuser1',
    'testuser2',
    'testuser3'
  ];

  beforeAll(async () => {
    // Clean up any existing test profiles
    for (const username of testUsernames) {
      await anonymousClient
        .from('creator_profiles')
        .delete()
        .or(`username.eq.${username},username.eq.${username.toUpperCase()},username.eq.${username.toLowerCase()}`);
    }
  });

  afterAll(async () => {
    // Clean up test data
    for (const username of testUsernames) {
      await anonymousClient
        .from('creator_profiles')
        .delete()
        .or(`username.eq.${username},username.eq.${username.toUpperCase()},username.eq.${username.toLowerCase()}`);
    }
  });

  it('should enforce case-insensitive username uniqueness', async () => {
    const baseUsername = 'uniquetest123';
    const variations = [
      baseUsername.toLowerCase(),
      baseUsername.toUpperCase(),
      'UniqueTest123',
      'UNIQUETEST123',
      'uniqueTest123'
    ];

    let createdProfileId: string | null = null;

    try {
      // First creation should succeed
      const { data: result1, error: error1 } = await anonymousClient
        .rpc('create_unclaimed_profile_secure', {
          username_param: variations[0],
          display_name_param: 'First User',
          creator_type_param: 'artist' as CreatorType
        });

      expect(error1).toBeNull();
      expect(result1).toBeDefined();
      const createResult1 = result1[0] as CreateUnclaimedProfileResult;
      expect(createResult1.success).toBe(true);
      expect(createResult1.profile_id).toBeDefined();
      createdProfileId = createResult1.profile_id!;

      // All subsequent attempts with case variations should fail
      for (let i = 1; i < variations.length; i++) {
        const { data: result, error } = await anonymousClient
          .rpc('create_unclaimed_profile_secure', {
            username_param: variations[i],
            display_name_param: `User ${i}`,
            creator_type_param: 'artist' as CreatorType
          });

        expect(error).toBeNull();
        expect(result).toBeDefined();
        const createResult = result[0] as CreateUnclaimedProfileResult;
        expect(createResult.success).toBe(false);
        expect(createResult.message).toContain('already exists');
      }

      // Verify the original profile exists with normalized username
      const { data: profile, error: fetchError } = await anonymousClient
        .from('creator_profiles')
        .select('username, username_normalized')
        .eq('id', createdProfileId)
        .single();

      expect(fetchError).toBeNull();
      expect(profile.username).toBe(variations[0]);
      expect(profile.username_normalized).toBe(variations[0].toLowerCase());

    } finally {
      // Clean up
      if (createdProfileId) {
        await anonymousClient
          .from('creator_profiles')
          .delete()
          .eq('id', createdProfileId);
      }
    }
  });

  it('should allow different usernames that only differ in more than case', async () => {
    const usernames = ['testuser123', 'testuser124', 'testuser125'];
    const createdIds: string[] = [];

    try {
      // All of these should succeed as they are genuinely different
      for (const username of usernames) {
        const { data: result, error } = await anonymousClient
          .rpc('create_unclaimed_profile_secure', {
            username_param: username,
            display_name_param: `User ${username}`,
            creator_type_param: 'artist' as CreatorType
          });

        expect(error).toBeNull();
        expect(result).toBeDefined();
        const createResult = result[0] as CreateUnclaimedProfileResult;
        expect(createResult.success).toBe(true);
        expect(createResult.profile_id).toBeDefined();
        createdIds.push(createResult.profile_id!);
      }

      // Verify all profiles were created
      const { data: profiles, error: fetchError } = await anonymousClient
        .from('creator_profiles')
        .select('id, username, username_normalized')
        .in('id', createdIds);

      expect(fetchError).toBeNull();
      expect(profiles).toHaveLength(3);
      
      // Check that usernames are normalized correctly
      profiles?.forEach(profile => {
        expect(profile.username_normalized).toBe(profile.username.toLowerCase());
      });

    } finally {
      // Clean up
      for (const id of createdIds) {
        await anonymousClient
          .from('creator_profiles')
          .delete()
          .eq('id', id);
      }
    }
  });

  it('should validate username format constraints', async () => {
    const invalidUsernames = [
      '', // empty
      'ab', // too short (less than 3 chars)
      'a'.repeat(31), // too long (more than 30 chars)
      'test@user', // invalid character (@)
      'test user', // space
      'test.user', // period
      'test+user', // plus sign
      'test#user', // hash
      'test$user', // dollar sign
      'user!', // exclamation
      'test&user', // ampersand
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
      expect(createResult.message).toMatch(/must be|Invalid|format/i);
    }
  });

  it('should allow valid username formats', async () => {
    const validUsernames = [
      'abc', // minimum length
      'user123',
      'test_user',
      'test-user',
      'User123',
      'a'.repeat(30), // maximum length
      'MixedCase123',
      'under_score',
      'hyphen-test',
      '123numbers',
      'ALLCAPS',
    ];

    const createdIds: string[] = [];

    try {
      for (const username of validUsernames) {
        const { data: result, error } = await anonymousClient
          .rpc('create_unclaimed_profile_secure', {
            username_param: username,
            display_name_param: `User ${username}`,
            creator_type_param: 'artist' as CreatorType
          });

        expect(error).toBeNull();
        expect(result).toBeDefined();
        const createResult = result[0] as CreateUnclaimedProfileResult;
        expect(createResult.success).toBe(true);
        expect(createResult.profile_id).toBeDefined();
        createdIds.push(createResult.profile_id!);
      }

    } finally {
      // Clean up
      for (const id of createdIds) {
        await anonymousClient
          .from('creator_profiles')
          .delete()
          .eq('id', id);
      }
    }
  });

  it('should handle concurrent username creation attempts', async () => {
    const username = 'concurrent-test';
    
    // Clean up any existing profile first
    await anonymousClient
      .from('creator_profiles')
      .delete()
      .eq('username_normalized', username.toLowerCase());

    // Attempt to create multiple profiles with the same username concurrently
    const promises = Array.from({ length: 5 }, (_, i) => 
      anonymousClient.rpc('create_unclaimed_profile_secure', {
        username_param: username,
        display_name_param: `Concurrent User ${i}`,
        creator_type_param: 'artist' as CreatorType
      })
    );

    const results = await Promise.all(promises);
    
    let successCount = 0;
    let failCount = 0;
    let createdProfileId: string | null = null;

    results.forEach(({ data, error }) => {
      expect(error).toBeNull();
      expect(data).toBeDefined();
      const createResult = data[0] as CreateUnclaimedProfileResult;
      
      if (createResult.success) {
        successCount++;
        createdProfileId = createResult.profile_id!;
      } else {
        failCount++;
        expect(createResult.message).toContain('already exists');
      }
    });

    // Exactly one should succeed, the rest should fail
    expect(successCount).toBe(1);
    expect(failCount).toBe(4);

    // Clean up
    if (createdProfileId) {
      await anonymousClient
        .from('creator_profiles')
        .delete()
        .eq('id', createdProfileId);
    }
  });
});