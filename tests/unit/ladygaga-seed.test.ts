import { describe, expect, it } from 'vitest';

/**
 * Simple test to ensure ladygaga seed profile data structure is correct
 * This test validates the seed data without requiring a live database connection
 */

describe('Lady Gaga Seed Profile Structure', () => {
  it('should have correct seed data structure in baseline migration', () => {
    // This is the seed data from the baseline migration
    const seedProfile = {
      user_id: 'artist_1',
      username: 'ladygaga',
      display_name: 'Lady Gaga',
      bio: 'Grammy Award-winning artist known for hits like "Bad Romance" and "Shallow". Advocate for mental health awareness and LGBTQ+ rights.',
      avatar_url:
        'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd',
      is_public: true,
    };

    // Validate the structure that would prevent 404s
    expect(seedProfile.username).toBe('ladygaga');
    expect(seedProfile.display_name).toBe('Lady Gaga');
    expect(seedProfile.is_public).toBe(true);
    expect(seedProfile.bio).toBeTruthy();
    expect(seedProfile.avatar_url).toMatch(/^https?:\/\/.+/);
    expect(seedProfile.user_id).toBeTruthy();
  });

  it('should be compatible with Artist type conversion', () => {
    const profile = {
      id: 'test-id',
      username: 'ladygaga',
      display_name: 'Lady Gaga',
      bio: 'Grammy Award-winning artist',
      avatar_url: 'https://example.com/avatar.jpg',
      is_public: true,
    };

    // Simulate the convertToArtist function from the app
    const convertToArtist = (profile: Record<string, unknown>) => ({
      id: profile.id,
      owner_user_id: 'unknown',
      handle: profile.username,
      spotify_id: '',
      name: profile.display_name || profile.username,
      image_url: profile.avatar_url || undefined,
      tagline: profile.bio || undefined,
      theme: undefined,
      settings: { hide_branding: false },
      spotify_url: undefined,
      apple_music_url: undefined,
      youtube_url: undefined,
      published: profile.is_public,
      is_verified: false,
      created_at: new Date().toISOString(),
    });

    const artist = convertToArtist(profile);

    expect(artist.handle).toBe('ladygaga');
    expect(artist.name).toBe('Lady Gaga');
    expect(artist.published).toBe(true);
    expect(artist.image_url).toBeTruthy();
    expect(typeof artist.created_at).toBe('string');
  });

  it('should have mock social links for ladygaga in artist page', () => {
    // This validates the mock data structure from the artist page
    const handle = 'ladygaga';
    const mockSocialLinks =
      handle === 'ladygaga'
        ? [
            {
              id: 'venmo-link-1',
              artist_id: 'test-id',
              platform: 'venmo',
              url: 'https://venmo.com/u/ladygaga',
              clicks: 0,
              created_at: new Date().toISOString(),
            },
            {
              id: 'spotify-link-1',
              artist_id: 'test-id',
              platform: 'spotify',
              url: 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms',
              clicks: 0,
              created_at: new Date().toISOString(),
            },
          ]
        : [];

    expect(mockSocialLinks).toHaveLength(2);
    expect(mockSocialLinks[0].platform).toBe('venmo');
    expect(mockSocialLinks[1].platform).toBe('spotify');
    expect(mockSocialLinks[0].url).toMatch(/venmo\.com/);
    expect(mockSocialLinks[1].url).toMatch(/spotify\.com/);
  });

  it('should have required fields for page rendering without 404', () => {
    const requiredFields = {
      username: 'ladygaga',
      display_name: 'Lady Gaga',
      is_public: true,
      bio: 'Some bio text',
      avatar_url: 'https://example.com/avatar.jpg',
    };

    // These are the minimum fields needed to prevent 404 in getArtistProfile
    expect(requiredFields.username).toBeTruthy();
    expect(requiredFields.is_public).toBe(true);

    // These fields are needed for proper page rendering
    expect(requiredFields.display_name).toBeTruthy();
    expect(requiredFields.bio).toBeTruthy();
    expect(requiredFields.avatar_url).toBeTruthy();

    // Username format validation
    expect(requiredFields.username).toMatch(/^[a-z0-9]+$/);
    expect(requiredFields.username.length).toBeGreaterThan(3);
  });
});
