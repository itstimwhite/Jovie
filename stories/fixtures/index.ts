/**
 * Storybook Fixtures
 * 
 * This module provides lightweight mock data for Storybook stories.
 * Import these fixtures to quickly create realistic stories without backend dependencies.
 * 
 * Usage:
 * ```tsx
 * import { mockCreatorProfile, mockSocialLinks } from '@/stories/fixtures';
 * 
 * export const Default: Story = {
 *   args: {
 *     profile: mockCreatorProfile(),
 *     links: mockSocialLinks(),
 *   },
 * };
 * ```
 * 
 * To extend or customize fixtures:
 * ```tsx
 * import { mockCreatorProfile } from '@/stories/fixtures';
 * 
 * const customProfile = mockCreatorProfile({
 *   display_name: 'Custom Name',
 *   bio: 'Custom bio text',
 * });
 * ```
 */

import { 
  AppUser, 
  CreatorProfile, 
  SocialLink, 
  Release, 
  ClickEvent, 
  Subscription, 
  Tip,
  CreatorType,
  LinkType,
  SubscriptionPlan,
  SubscriptionStatus,
  CurrencyCode,
  SocialPlatform
} from '@/types';

// Helper to generate ISO date strings
const isoDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Helper to generate random IDs
const generateId = () => `id_${Math.random().toString(36).substring(2, 10)}`;

/**
 * Mock AppUser
 */
export const mockAppUser = (overrides?: Partial<AppUser>): AppUser => ({
  id: 'user_2a8b4c6d8e0f2g4h6i8j0k2l4m',
  email: 'user@example.com',
  is_pro: false,
  created_at: isoDate(90),
  ...overrides
});

/**
 * Mock CreatorProfile
 */
export const mockCreatorProfile = (overrides?: Partial<CreatorProfile>): CreatorProfile => ({
  id: 'profile_1a2b3c4d5e6f7g8h9i0j',
  user_id: 'user_2a8b4c6d8e0f2g4h6i8j0k2l4m',
  creator_type: 'artist',
  username: 'artistname',
  display_name: 'Artist Name',
  bio: 'Independent musician based in Los Angeles, CA',
  avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&h=250&fit=crop',
  spotify_url: 'https://open.spotify.com/artist/example',
  apple_music_url: 'https://music.apple.com/artist/example',
  youtube_url: 'https://youtube.com/channel/example',
  spotify_id: 'spotify_1234567890',
  is_public: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  is_claimed: true,
  claim_token: null,
  claimed_at: isoDate(60),
  profile_views: 1250,
  username_normalized: 'artistname',
  search_text: 'artistname artist name independent musician los angeles',
  display_title: 'Artist Name',
  profile_completion_pct: 85,
  settings: { hide_branding: false },
  theme: { 
    primary_color: '#3b82f6',
    text_color: '#ffffff',
    background_color: '#111827'
  },
  created_at: isoDate(90),
  updated_at: isoDate(5),
  ...overrides
});

/**
 * Mock SocialLink
 */
export const mockSocialLink = (overrides?: Partial<SocialLink>): SocialLink => ({
  id: generateId(),
  creator_profile_id: 'profile_1a2b3c4d5e6f7g8h9i0j',
  platform: 'instagram',
  platform_type: 'instagram',
  url: 'https://instagram.com/artistname',
  display_text: '@artistname',
  sort_order: 1,
  clicks: 42,
  is_active: true,
  created_at: isoDate(85),
  updated_at: isoDate(10),
  ...overrides
});

/**
 * Mock multiple SocialLinks
 */
export const mockSocialLinks = (count = 5, overrides?: Partial<SocialLink>): SocialLink[] => {
  const platforms: SocialPlatform[] = ['instagram', 'spotify', 'twitter', 'tiktok', 'youtube', 'apple_music', 'soundcloud'];
  
  return Array.from({ length: count }, (_, i) => mockSocialLink({
    id: generateId(),
    platform: platforms[i % platforms.length],
    platform_type: platforms[i % platforms.length],
    url: `https://${platforms[i % platforms.length].replace('_', '')}.com/artistname`,
    display_text: `@artistname`,
    sort_order: i + 1,
    ...overrides
  }));
};

/**
 * Mock Release
 */
export const mockRelease = (overrides?: Partial<Release>): Release => ({
  id: generateId(),
  creator_id: 'profile_1a2b3c4d5e6f7g8h9i0j',
  dsp: 'spotify',
  title: 'New Single',
  url: 'https://open.spotify.com/track/example',
  release_date: isoDate(30),
  created_at: isoDate(30),
  updated_at: isoDate(30),
  ...overrides
});

/**
 * Mock multiple Releases
 */
export const mockReleases = (count = 3, overrides?: Partial<Release>): Release[] => {
  const titles = ['New Single', 'Debut Album', 'Acoustic EP', 'Live Session', 'Remix Collection'];
  const dsps = ['spotify', 'apple_music', 'youtube_music', 'soundcloud', 'bandcamp'];
  
  return Array.from({ length: count }, (_, i) => mockRelease({
    id: generateId(),
    dsp: dsps[i % dsps.length],
    title: titles[i % titles.length],
    release_date: isoDate(i * 30),
    ...overrides
  }));
};

/**
 * Mock ClickEvent
 */
export const mockClickEvent = (overrides?: Partial<ClickEvent>): ClickEvent => ({
  id: generateId(),
  creator_id: 'profile_1a2b3c4d5e6f7g8h9i0j',
  link_type: 'listen',
  target: 'spotify',
  ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
  platform_detected: 'mobile',
  created_at: isoDate(Math.floor(Math.random() * 30)),
  ...overrides
});

/**
 * Mock multiple ClickEvents
 */
export const mockClickEvents = (count = 10, overrides?: Partial<ClickEvent>): ClickEvent[] => {
  const linkTypes: LinkType[] = ['listen', 'social', 'tip', 'other'];
  const targets = ['spotify', 'apple_music', 'instagram', 'twitter', 'tiktok', 'paypal', 'website'];
  
  return Array.from({ length: count }, (_, i) => mockClickEvent({
    id: generateId(),
    link_type: linkTypes[i % linkTypes.length],
    target: targets[i % targets.length],
    created_at: isoDate(Math.floor(Math.random() * 30)),
    ...overrides
  }));
};

/**
 * Mock Subscription
 */
export const mockSubscription = (overrides?: Partial<Subscription>): Subscription => ({
  id: generateId(),
  user_id: 'user_2a8b4c6d8e0f2g4h6i8j0k2l4m',
  plan: 'premium',
  status: 'active',
  stripe_customer_id: 'cus_example123',
  stripe_subscription_id: 'sub_example123',
  stripe_price_id: 'price_example123',
  current_period_start: isoDate(15),
  current_period_end: isoDate(-15), // 15 days in the future
  created_at: isoDate(45),
  updated_at: isoDate(15),
  ...overrides
});

/**
 * Mock Tip
 */
export const mockTip = (overrides?: Partial<Tip>): Tip => ({
  id: generateId(),
  creator_id: 'profile_1a2b3c4d5e6f7g8h9i0j',
  contact_email: 'fan@example.com',
  amount_cents: 500, // $5.00
  currency: 'USD',
  payment_intent: 'pi_example123',
  created_at: isoDate(Math.floor(Math.random() * 30)),
  updated_at: isoDate(Math.floor(Math.random() * 30)),
  ...overrides
});

/**
 * Mock multiple Tips
 */
export const mockTips = (count = 3, overrides?: Partial<Tip>): Tip[] => {
  const amounts = [500, 1000, 1500, 2000, 5000];
  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  return Array.from({ length: count }, (_, i) => mockTip({
    id: generateId(),
    amount_cents: amounts[i % amounts.length],
    currency: currencies[i % currencies.length],
    ...overrides
  }));
};

// Export type constants for convenience
export const creatorTypes: CreatorType[] = ['artist', 'podcaster', 'influencer', 'creator'];
export const linkTypes: LinkType[] = ['listen', 'social', 'tip', 'other'];
export const subscriptionPlans: SubscriptionPlan[] = ['free', 'basic', 'premium', 'pro'];
export const subscriptionStatuses: SubscriptionStatus[] = [
  'active', 'inactive', 'cancelled', 'past_due', 
  'trialing', 'incomplete', 'incomplete_expired', 'unpaid'
];
export const currencyCodes: CurrencyCode[] = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 
  'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
];

