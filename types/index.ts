// =====================================
// SHARED TYPE EXPORTS
// =====================================
// This file exports commonly used types and enums for easy importing across the app
// Usage: import { LinkType, SubscriptionPlan } from '@/types';

// Import types for internal use
import type {
  CreatorType,
  LinkType,
  SubscriptionPlan,
  SubscriptionStatus,
  CurrencyCode,
  SocialPlatform,
} from './db';

// Re-export shared enums and types from db.ts
export type {
  // Enums
  CreatorType,
  LinkType,
  SubscriptionPlan,
  SubscriptionStatus,
  CurrencyCode,
  SocialPlatform,

  // Core interfaces
  AppUser,
  CreatorProfile,
  SocialLink,

  // Content interfaces
  Release,

  // Analytics interfaces
  ClickEvent,

  // Billing interfaces
  Subscription,
  Tip,

  // Utility interfaces
  RateLimitResult,

  // Backwards compatibility
  Artist,
  LegacySocialLink,
  User,

  // Specialized types
  ArtistProfile,
  PodcasterProfile,
} from './db';

// Re-export utility functions
export {
  isArtistProfile,
  isPodcasterProfile,
  convertCreatorProfileToArtist,
  convertArtistToCreatorProfile,
} from './db';

// =====================================
// CONSTANTS FOR SHARED ENUMS
// =====================================
// These constants can be used for validation, select options, etc.

export const CREATOR_TYPES: readonly CreatorType[] = [
  'artist',
  'podcaster',
  'influencer',
  'creator',
] as const;

export const LINK_TYPES: readonly LinkType[] = [
  'listen',
  'social',
  'tip',
  'other',
] as const;

export const SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  'free',
  'basic',
  'premium',
  'pro',
] as const;

export const SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  'active',
  'inactive',
  'cancelled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'unpaid',
] as const;

export const CURRENCY_CODES: readonly CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
] as const;

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  // Music Platforms
  'spotify',
  'apple_music',
  'youtube_music',
  'soundcloud',
  'bandcamp',
  'tidal',
  'deezer',
  'amazon_music',
  'pandora',
  // Social Media
  'instagram',
  'twitter',
  'x',
  'tiktok',
  'youtube',
  'facebook',
  'linkedin',
  'snapchat',
  'pinterest',
  'reddit',
  // Creator/Content Platforms
  'twitch',
  'discord',
  'patreon',
  'onlyfans',
  'substack',
  'medium',
  'github',
  'behance',
  'dribbble',
  // Link Aggregators
  'linktree',
  'beacons',
  'linkin_bio',
  'allmylinks',
  'linkfire',
  'toneden',
  // Payment/Tip Platforms
  'venmo',
  'paypal',
  'cashapp',
  'zelle',
  'ko_fi',
  'buymeacoffee',
  'gofundme',
  // Messaging/Communication
  'whatsapp',
  'telegram',
  'signal',
  'email',
  'phone',
  // Professional
  'website',
  'blog',
  'portfolio',
  'booking',
  'press_kit',
  // Other
  'other',
] as const;

// =====================================
// VALIDATION HELPERS
// =====================================

export function isValidCreatorType(value: string): value is CreatorType {
  return CREATOR_TYPES.includes(value as CreatorType);
}

export function isValidLinkType(value: string): value is LinkType {
  return LINK_TYPES.includes(value as LinkType);
}

export function isValidSubscriptionPlan(
  value: string
): value is SubscriptionPlan {
  return SUBSCRIPTION_PLANS.includes(value as SubscriptionPlan);
}

export function isValidSubscriptionStatus(
  value: string
): value is SubscriptionStatus {
  return SUBSCRIPTION_STATUSES.includes(value as SubscriptionStatus);
}

export function isValidCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.includes(value as CurrencyCode);
}

export function isValidSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(value as SocialPlatform);
}

// =====================================
// DISPLAY HELPERS
// =====================================

export function getCreatorTypeLabel(type: CreatorType): string {
  const labels: Record<CreatorType, string> = {
    artist: 'Artist',
    podcaster: 'Podcaster',
    influencer: 'Influencer',
    creator: 'Creator',
  };
  return labels[type];
}

export function getSubscriptionPlanLabel(plan: SubscriptionPlan): string {
  const labels: Record<SubscriptionPlan, string> = {
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    pro: 'Pro',
  };
  return labels[plan];
}

export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    cancelled: 'Cancelled',
    past_due: 'Past Due',
    trialing: 'Trialing',
    incomplete: 'Incomplete',
    incomplete_expired: 'Incomplete (Expired)',
    unpaid: 'Unpaid',
  };
  return labels[status];
}

export function getCurrencySymbol(code: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
  };
  return symbols[code];
}

export function getSocialPlatformLabel(platform: SocialPlatform): string {
  const labels: Partial<Record<SocialPlatform, string>> = {
    spotify: 'Spotify',
    apple_music: 'Apple Music',
    youtube: 'YouTube',
    youtube_music: 'YouTube Music',
    soundcloud: 'SoundCloud',
    bandcamp: 'Bandcamp',
    instagram: 'Instagram',
    twitter: 'Twitter',
    x: 'X (Twitter)',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    twitch: 'Twitch',
    discord: 'Discord',
    patreon: 'Patreon',
    venmo: 'Venmo',
    paypal: 'PayPal',
    cashapp: 'Cash App',
    ko_fi: 'Ko-fi',
    buymeacoffee: 'Buy Me a Coffee',
    linktree: 'Linktree',
    website: 'Website',
    email: 'Email',
    phone: 'Phone',
  };
  return (
    labels[platform] ||
    platform.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
  );
}
