export interface User {
  id: string;
  clerk_id: string;
  email: string;
  created_at: string;
}

export interface Artist {
  id: string;
  owner_user_id: string;
  handle: string;
  spotify_id: string;
  name: string;
  image_url?: string;
  tagline?: string;
  theme?: Record<string, unknown>;
  settings?: {
    hide_branding?: boolean;
  };
  spotify_url?: string;
  apple_music_url?: string;
  youtube_url?: string;
  published: boolean;
  is_verified: boolean;
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
