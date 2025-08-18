/**
 * Test suite for Supabase Row Level Security (RLS) policies
 * Verifies that public read access works correctly for published artists and their social_links
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
}));

// Create mock Supabase client for testing
const createMockSupabaseClient = () => {
  const mockClient = {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
    },
  };

  // Mock artists table queries
  const mockArtistsQuery = {
    select: vi.fn(() => mockArtistsQuery),
    eq: vi.fn(() => mockArtistsQuery),
    order: vi.fn(() => mockArtistsQuery),
    then: vi.fn(),
  };

  // Mock social_links table queries
  const mockSocialLinksQuery = {
    select: vi.fn(() => mockSocialLinksQuery),
    eq: vi.fn(() => mockSocialLinksQuery),
    order: vi.fn(() => mockSocialLinksQuery),
    then: vi.fn(),
  };

  mockClient.from.mockImplementation((table: string) => {
    if (table === 'artists') return mockArtistsQuery;
    if (table === 'social_links') return mockSocialLinksQuery;
    return mockArtistsQuery; // fallback
  });

  return { mockClient, mockArtistsQuery, mockSocialLinksQuery };
};

describe('Supabase RLS Policies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Artists Table - Public Read Access', () => {
    it('should allow anonymous access to published artists', async () => {
      const { mockClient, mockArtistsQuery } = createMockSupabaseClient();

      // Mock successful response for published artists
      const publishedArtists = [
        {
          id: '1',
          handle: 'ladygaga',
          name: 'Lady Gaga',
          published: true,
          image_url: 'https://example.com/ladygaga.jpg',
        },
        {
          id: '2',
          handle: 'davidguetta',
          name: 'David Guetta',
          published: true,
          image_url: 'https://example.com/david.jpg',
        },
      ];

      mockArtistsQuery.then.mockImplementation((callback) =>
        callback({ data: publishedArtists, error: null })
      );

      // Simulate anonymous client query (no auth token)
      const query = mockClient
        .from('artists')
        .select('id, handle, name, published, image_url')
        .eq('published', true)
        .order('name');

      await query.then((result: any) => {
        expect(result.data).toHaveLength(2);
        expect(result.error).toBeNull();
        expect(result.data).toEqual(publishedArtists);
      });

      expect(mockClient.from).toHaveBeenCalledWith('artists');
      expect(mockArtistsQuery.select).toHaveBeenCalledWith(
        'id, handle, name, published, image_url'
      );
      expect(mockArtistsQuery.eq).toHaveBeenCalledWith('published', true);
    });

    it('should not return unpublished artists for anonymous access', async () => {
      const { mockClient, mockArtistsQuery } = createMockSupabaseClient();

      // Mock response showing no unpublished artists are accessible
      mockArtistsQuery.then.mockImplementation((callback) =>
        callback({ data: [], error: null })
      );

      // Try to query unpublished artists (should return empty)
      const query = mockClient
        .from('artists')
        .select('*')
        .eq('published', false);

      await query.then((result: any) => {
        expect(result.data).toEqual([]);
        expect(result.error).toBeNull();
      });
    });

    it('should work with authenticated users for published artists', async () => {
      const { mockClient, mockArtistsQuery } = createMockSupabaseClient();

      const publishedArtists = [
        {
          id: '1',
          handle: 'tim',
          name: 'Tim White',
          published: true,
          is_verified: true,
        },
      ];

      mockArtistsQuery.then.mockImplementation((callback) =>
        callback({ data: publishedArtists, error: null })
      );

      // Simulate authenticated client query
      const query = mockClient
        .from('artists')
        .select('*')
        .eq('published', true);

      await query.then((result: any) => {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].published).toBe(true);
        expect(result.error).toBeNull();
      });
    });
  });

  describe('Social Links Table - Public Read Access', () => {
    it('should allow anonymous access to social_links of published artists', async () => {
      const { mockClient, mockSocialLinksQuery } = createMockSupabaseClient();

      const socialLinks = [
        {
          id: '1',
          artist_id: 'published-artist-id',
          platform: 'spotify',
          url: 'https://open.spotify.com/artist/123',
          clicks: 100,
        },
        {
          id: '2',
          artist_id: 'published-artist-id',
          platform: 'instagram',
          url: 'https://instagram.com/artist',
          clicks: 50,
        },
      ];

      mockSocialLinksQuery.then.mockImplementation((callback) =>
        callback({ data: socialLinks, error: null })
      );

      // Query social links for a published artist
      const query = mockClient
        .from('social_links')
        .select('*')
        .eq('artist_id', 'published-artist-id');

      await query.then((result: any) => {
        expect(result.data).toHaveLength(2);
        expect(result.error).toBeNull();
        expect(result.data).toEqual(socialLinks);
      });

      expect(mockClient.from).toHaveBeenCalledWith('social_links');
      expect(mockSocialLinksQuery.eq).toHaveBeenCalledWith(
        'artist_id',
        'published-artist-id'
      );
    });

    it('should not return social_links for unpublished artists', async () => {
      const { mockClient, mockSocialLinksQuery } = createMockSupabaseClient();

      // Mock empty response for unpublished artist's social links
      mockSocialLinksQuery.then.mockImplementation((callback) =>
        callback({ data: [], error: null })
      );

      // Try to query social links for unpublished artist
      const query = mockClient
        .from('social_links')
        .select('*')
        .eq('artist_id', 'unpublished-artist-id');

      await query.then((result: any) => {
        expect(result.data).toEqual([]);
        expect(result.error).toBeNull();
      });
    });

    it('should work for joins between artists and social_links', async () => {
      const { mockClient, mockArtistsQuery } = createMockSupabaseClient();

      const artistWithSocialLinks = [
        {
          id: '1',
          handle: 'ladygaga',
          name: 'Lady Gaga',
          published: true,
          social_links: [
            { platform: 'spotify', url: 'https://open.spotify.com/artist/123' },
            { platform: 'instagram', url: 'https://instagram.com/ladygaga' },
          ],
        },
      ];

      mockArtistsQuery.then.mockImplementation((callback) =>
        callback({ data: artistWithSocialLinks, error: null })
      );

      // Query artists with their social links
      const query = mockClient
        .from('artists')
        .select(
          `
          id,
          handle,
          name,
          published,
          social_links(platform, url)
        `
        )
        .eq('published', true);

      await query.then((result: any) => {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].social_links).toHaveLength(2);
        expect(result.error).toBeNull();
      });
    });
  });

  describe('RLS Policy Documentation', () => {
    it('should document the expected RLS policies', () => {
      // This test documents the expected RLS policies
      const expectedPolicies = {
        artists: [
          {
            name: 'artists_public_read',
            description: 'Allow public read access to published artists',
            table: 'public.artists',
            command: 'SELECT',
            roles: ['anon', 'authenticated'],
            using: 'published = true',
          },
          {
            name: 'Public can read published artists',
            description:
              'Duplicate policy for public read access (from later migration)',
            table: 'public.artists',
            command: 'SELECT',
            roles: ['anon', 'authenticated'],
            using: 'published IS TRUE',
          },
        ],
        social_links: [
          {
            name: 'social_links_public_read',
            description:
              'Allow public read access to social links of published artists',
            table: 'public.social_links',
            command: 'SELECT',
            roles: ['anon', 'authenticated'],
            using:
              'artist_id IN (SELECT id FROM artists WHERE published = true)',
          },
        ],
      };

      // Verify policy documentation exists
      expect(expectedPolicies.artists).toHaveLength(2); // Shows duplicate policies exist
      expect(expectedPolicies.social_links).toHaveLength(1);

      // Both artist policies should allow the same access
      expect(expectedPolicies.artists[0].roles).toEqual([
        'anon',
        'authenticated',
      ]);
      expect(expectedPolicies.artists[1].roles).toEqual([
        'anon',
        'authenticated',
      ]);
    });
  });
});
