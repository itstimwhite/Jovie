import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSocialLinksFromDB } from '@/lib/utils/platform-detection';
import type { CreatorProfile, LegacySocialLink } from '@/types/db';

// Mock the Supabase client
vi.mock('@/lib/supabase-server', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase-server';

describe('getSocialLinksFromDB', () => {
  const mockProfile: CreatorProfile = {
    id: 'profile-123',
    user_id: 'user-123',
    creator_type: 'artist',
    username: 'testartist',
    display_name: 'Test Artist',
    bio: 'Test bio',
    avatar_url: null,
    spotify_url: null,
    apple_music_url: null,
    youtube_url: null,
    spotify_id: null,
    is_public: true,
    is_verified: false,
    is_featured: false,
    marketing_opt_out: false,
    is_claimed: true,
    claim_token: null,
    claimed_at: '2023-01-01T00:00:00Z',
    profile_views: 0,
    username_normalized: 'testartist',
    search_text: 'testartist test artist',
    display_title: 'Test Artist',
    profile_completion_pct: 50,
    settings: null,
    theme: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  const mockDbLinks = [
    {
      id: 'link-1',
      creator_profile_id: 'profile-123',
      platform: 'instagram',
      platform_type: 'instagram',
      url: 'https://instagram.com/testartist',
      display_text: '@testartist',
      sort_order: 1,
      clicks: 10,
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 'link-2',
      creator_profile_id: 'profile-123',
      platform: 'spotify',
      platform_type: 'spotify',
      url: 'https://open.spotify.com/artist/123456',
      display_text: null,
      sort_order: 2,
      clicks: 5,
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ];

  const mockSupabaseClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createServerClient as any).mockReturnValue(mockSupabaseClient);
  });

  it('should return social links in LegacySocialLink format', async () => {
    // Mock the Supabase response
    mockSupabaseClient.order.mockResolvedValue({
      data: mockDbLinks,
      error: null,
    });

    const result = await getSocialLinksFromDB(mockProfile);

    // Verify Supabase client was called correctly
    expect(createServerClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('social_links');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith(
      'id, creator_profile_id, platform, platform_type, url, clicks, created_at'
    );
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith(
      'creator_profile_id',
      'profile-123'
    );
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('is_active', true);
    expect(mockSupabaseClient.order).toHaveBeenCalledWith('sort_order', {
      ascending: true,
    });

    // Verify the result is mapped correctly
    const expectedLinks: LegacySocialLink[] = [
      {
        id: 'link-1',
        artist_id: 'profile-123',
        platform: 'instagram',
        url: 'https://instagram.com/testartist',
        clicks: 10,
        created_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 'link-2',
        artist_id: 'profile-123',
        platform: 'spotify',
        url: 'https://open.spotify.com/artist/123456',
        clicks: 5,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    expect(result).toEqual(expectedLinks);
  });

  it('should return empty array when Supabase client is null', async () => {
    (createServerClient as any).mockReturnValue(null);

    const result = await getSocialLinksFromDB(mockProfile);

    expect(result).toEqual([]);
  });

  it('should return empty array when Supabase query fails', async () => {
    mockSupabaseClient.order.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const result = await getSocialLinksFromDB(mockProfile);

    expect(result).toEqual([]);
  });

  it('should handle empty data result', async () => {
    mockSupabaseClient.order.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await getSocialLinksFromDB(mockProfile);

    expect(result).toEqual([]);
  });

  it('should handle unexpected errors', async () => {
    mockSupabaseClient.order.mockRejectedValue(new Error('Unexpected error'));

    const result = await getSocialLinksFromDB(mockProfile);

    expect(result).toEqual([]);
  });
});
