export interface AppUser {
  id: string; // Clerk user id (sub)
  email: string;
  created_at: string;
}

export type CreatorType = 'artist' | 'podcaster' | 'influencer' | 'creator';

export interface CreatorProfile {
  id: string;
  user_id: string;
  creator_type: CreatorType;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
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
  artist_id: string;
  platform: string;
  url: string;
  clicks: number;
  created_at: string;
}

export interface Release {
  id: string;
  artist_id: string;
  dsp: string;
  title: string;
  url: string;
  release_date?: string;
  created_at: string;
}

export interface ClickEvent {
  id: string;
  artist_id: string;
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
  artist_id: string;
  contact_email?: string;
  contact_phone?: string;
  amount_cents: number;
  currency: string;
  payment_intent: string;
  created_at: string;
}
