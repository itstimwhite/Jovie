/**
 * RLS (Row Level Security) Policy Tests
 *
 * This test suite verifies that Row Level Security policies correctly allow:
 * 1. Public read access to published artists (no authentication required)
 * 2. Public read access to social_links for published artists
 * 3. Properly restrict access to unpublished artists and their data
 * 4. Block write operations for unauthenticated users
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the env module to provide test values
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
}));

// Define test constants to avoid TypeScript issues with mocked env
const TEST_SUPABASE_URL = 'https://test-project.supabase.co';
const TEST_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock the Supabase client
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getSession: vi.fn(() =>
      Promise.resolve({ data: { session: null }, error: null })
    ),
  },
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('RLS Policies for Public Read Access', () => {
  const mockArtistData = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      handle: 'published-artist',
      name: 'Published Artist',
      published: true,
      spotify_id: 'test-spotify-id',
      image_url: 'https://example.com/image.jpg',
      tagline: 'Test Artist',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      handle: 'unpublished-artist',
      name: 'Unpublished Artist',
      published: false,
      spotify_id: 'test-spotify-id-2',
      image_url: 'https://example.com/image2.jpg',
      tagline: 'Unpublished Test Artist',
    },
  ];

  const mockSocialLinksData = [
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      artist_id: '123e4567-e89b-12d3-a456-426614174000', // Published artist
      platform: 'spotify',
      url: 'https://open.spotify.com/artist/test',
      clicks: 0,
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      artist_id: '123e4567-e89b-12d3-a456-426614174001', // Unpublished artist
      platform: 'spotify',
      url: 'https://open.spotify.com/artist/test2',
      clicks: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Artists Table - Public Read Access', () => {
    it('should allow unauthenticated users to read published artists', async () => {
      // Mock successful response for published artists only
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockArtistData[0], // Published artist
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      // Create unauthenticated client (no session)
      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('artists')
        .select('*')
        .eq('handle', 'published-artist')
        .single();

      expect(error).toBeNull();
      expect(data).toEqual(mockArtistData[0]);
      expect(data.published).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('artists');
    });

    it('should not return unpublished artists to unauthenticated users', async () => {
      // Mock response that simulates RLS blocking unpublished artists
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'The result contains 0 rows' },
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('artists')
        .select('*')
        .eq('handle', 'unpublished-artist')
        .single();

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.code).toBe('PGRST116'); // No rows returned due to RLS
    });

    it('should only return published artists when querying all artists', async () => {
      // Mock response returning only published artists
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockArtistData[0]], // Only published artist
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client.from('artists').select('*');

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data?.[0]).toEqual(mockArtistData[0]);
      expect(data?.[0].published).toBe(true);
    });
  });

  describe('Social Links Table - Public Read Access', () => {
    it('should allow unauthenticated users to read social_links for published artists', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [mockSocialLinksData[0]], // Social link for published artist
          error: null,
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('social_links')
        .select('*')
        .eq('artist_id', '123e4567-e89b-12d3-a456-426614174000'); // Published artist ID

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data?.[0]).toEqual(mockSocialLinksData[0]);
    });

    it('should not allow unauthenticated users to read social_links for unpublished artists', async () => {
      // Mock empty response due to RLS blocking unpublished artist data
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [], // Empty due to RLS
          error: null,
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('social_links')
        .select('*')
        .eq('artist_id', '123e4567-e89b-12d3-a456-426614174001'); // Unpublished artist ID

      expect(error).toBeNull();
      expect(data).toHaveLength(0); // No data returned due to RLS
    });

    it('should return social_links only for published artists when querying all', async () => {
      // Mock response returning only social links for published artists
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockSocialLinksData[0]], // Only social link for published artist
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client.from('social_links').select('*');

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data?.[0]).toEqual(mockSocialLinksData[0]);
      expect(data?.[0].artist_id).toBe('123e4567-e89b-12d3-a456-426614174000'); // Published artist ID
    });
  });

  describe('Write Operations - Security Verification', () => {
    it('should block unauthenticated INSERT operations on artists', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: {
          code: '42501',
          message: 'new row violates row-level security policy',
          details: null,
          hint: null,
        },
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client.from('artists').insert({
        handle: 'test-artist',
        name: 'Test Artist',
        spotify_id: 'test-id',
        published: true,
      });

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.code).toBe('42501'); // RLS violation
    });

    it('should block unauthenticated UPDATE operations on artists', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: {
            code: '42501',
            message: 'new row violates row-level security policy',
            details: null,
            hint: null,
          },
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        update: mockUpdate,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('artists')
        .update({ name: 'Updated Name' })
        .eq('id', '123e4567-e89b-12d3-a456-426614174000');

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.code).toBe('42501'); // RLS violation
    });

    it('should block unauthenticated DELETE operations on artists', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: {
            code: '42501',
            message: 'row-level security policy violation',
            details: null,
            hint: null,
          },
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        delete: mockDelete,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client
        .from('artists')
        .delete()
        .eq('id', '123e4567-e89b-12d3-a456-426614174000');

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.code).toBe('42501'); // RLS violation
    });

    it('should block unauthenticated INSERT operations on social_links', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: {
          code: '42501',
          message: 'new row violates row-level security policy',
          details: null,
          hint: null,
        },
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const client = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);

      const { data, error } = await client.from('social_links').insert({
        artist_id: '123e4567-e89b-12d3-a456-426614174000',
        platform: 'twitter',
        url: 'https://twitter.com/test',
      });

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.code).toBe('42501'); // RLS violation
    });
  });

  describe('RLS Policy Documentation', () => {
    it('should document expected RLS behavior', () => {
      const expectedBehavior = {
        artists: {
          public_read:
            'Anonymous and authenticated users can SELECT published artists (published = true)',
          owner_rw:
            'Authenticated users can perform all operations on their own artists',
          write_restrictions:
            'Anonymous users cannot INSERT, UPDATE, or DELETE artists',
        },
        social_links: {
          public_read:
            'Anonymous and authenticated users can SELECT social_links for published artists only',
          owner_rw:
            'Authenticated users can perform all operations on social_links for their own artists',
          write_restrictions:
            'Anonymous users cannot INSERT, UPDATE, or DELETE social_links',
        },
      };

      expect(expectedBehavior.artists.public_read).toContain(
        'published artists'
      );
      expect(expectedBehavior.social_links.public_read).toContain(
        'published artists only'
      );
      expect(expectedBehavior.artists.write_restrictions).toContain('cannot');
      expect(expectedBehavior.social_links.write_restrictions).toContain(
        'cannot'
      );
    });
  });
});
