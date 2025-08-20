export interface AppUser {
  id: string; // Clerk user id (sub)
  email: string | null;
  created_at: string;
}

export type CreatorType = 'artist' | 'podcaster' | 'influencer' | 'creator';

export interface CreatorProfile {
  id: string;
  user_id: string | null; // Nullable to support unclaimed profiles
  creator_type: CreatorType;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  // Music platform URLs (for artists)
  spotify_url: string | null;
  apple_music_url: string | null;
  youtube_url: string | null;
  spotify_id: string | null;
  // Visibility and metadata
  is_public: boolean;
  is_verified: boolean;
  is_featured: boolean;
  marketing_opt_out: boolean;
  // Claiming functionality
  is_claimed: boolean;
  claim_token: string | null;
  claimed_at: string | null;
  settings: Record<string, unknown> | null;
  theme: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// Backwards compatibility - Artist interface mapped from CreatorProfile
export interface Artist {
  id: string;
  owner_user_id: string; // maps to user_id
  handle: string; // maps to username
  spotify_id: string;
  name: string; // maps to display_name
  image_url?: string; // maps to avatar_url
  tagline?: string; // maps to bio
  theme?: Record<string, unknown>;
  settings?: {
    hide_branding?: boolean;
  };
  spotify_url?: string;
  apple_music_url?: string;
  youtube_url?: string;
  published: boolean; // maps to is_public
  is_verified: boolean;
  is_featured: boolean;
  marketing_opt_out: boolean;
  created_at: string;
}

// Legacy User interface for backwards compatibility
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  creator_id: string; // Updated to reference creator_profiles
  platform: string;
  url: string;
  clicks: number;
  created_at: string;
}

// Legacy interface for backwards compatibility
export interface LegacySocialLink {
  id: string;
  artist_id: string; // Old reference for backwards compatibility
  platform: string;
  url: string;
  clicks: number;
  created_at: string;
}

export interface Release {
  id: string;
  creator_id: string; // Updated to reference creator_profiles
  dsp: string;
  title: string;
  url: string;
  release_date?: string;
  created_at: string;
}

export interface ClickEvent {
  id: string;
  creator_id: string; // Updated to reference creator_profiles
  link_type: 'listen' | 'social';
  target: string;
  ua?: string;
  platform_detected?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  revenuecat_id?: string;
  created_at: string;
}

export interface Tip {
  id: string;
  creator_id: string; // Updated to reference creator_profiles
  contact_email?: string;
  contact_phone?: string;
  amount_cents: number;
  currency: string;
  payment_intent: string;
  created_at: string;
}

// =====================================
// UTILITY TYPES AND FUNCTIONS
// =====================================

// Specific creator profile types
export interface ArtistProfile extends CreatorProfile {
  creator_type: 'artist';
}

export interface PodcasterProfile extends CreatorProfile {
  creator_type: 'podcaster';
}

// Type guards
export function isArtistProfile(
  profile: CreatorProfile
): profile is ArtistProfile {
  return profile.creator_type === 'artist';
}

export function isPodcasterProfile(
  profile: CreatorProfile
): profile is PodcasterProfile {
  return profile.creator_type === 'podcaster';
}

// Conversion utilities
export function convertCreatorProfileToArtist(profile: CreatorProfile): Artist {
  return {
    id: profile.id,
    owner_user_id: profile.user_id || '', // Handle null user_id for unclaimed profiles
    handle: profile.username,
    spotify_id: profile.spotify_id || '',
    name: profile.display_name || profile.username,
    image_url: profile.avatar_url || undefined,
    tagline: profile.bio || undefined,
    theme: profile.theme || undefined,
    settings: (profile.settings as { hide_branding?: boolean }) || {
      hide_branding: false,
    },
    spotify_url: profile.spotify_url || undefined,
    apple_music_url: profile.apple_music_url || undefined,
    youtube_url: profile.youtube_url || undefined,
    published: profile.is_public,
    is_verified: profile.is_verified,
    is_featured: profile.is_featured,
    marketing_opt_out: profile.marketing_opt_out,
    created_at: profile.created_at,
  };
}

export function convertArtistToCreatorProfile(
  artist: Artist
): Partial<CreatorProfile> {
  return {
    user_id: artist.owner_user_id,
    creator_type: 'artist',
    username: artist.handle,
    display_name: artist.name,
    bio: artist.tagline,
    avatar_url: artist.image_url,
    spotify_url: artist.spotify_url,
    apple_music_url: artist.apple_music_url,
    youtube_url: artist.youtube_url,
    spotify_id: artist.spotify_id,
    is_public: artist.published,
    is_verified: artist.is_verified,
    is_featured: artist.is_featured,
    marketing_opt_out: artist.marketing_opt_out,
    settings: artist.settings,
    theme: artist.theme,
  };
}
