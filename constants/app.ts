export const APP_NAME = 'Jovie';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie';
export const MAX_SOCIAL_LINKS = 6;
export const LISTEN_COOKIE = 'jovie_dsp';
export const DSPS = {
  spotify: 'spotify',
  apple_music: 'apple_music',
  youtube: 'youtube',
} as const;
export const DEFAULT_PROFILE_TAGLINE = 'Artist';
export const ANALYTICS = {
  segmentWriteKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY ?? '',
};

// Feature flags
export const FEATURE_FLAGS = {
  // Control waitlist mode via environment variable
  // When WAITLIST_ENABLED=true: show waitlist page, hide artist search, convert sign-up buttons to waitlist buttons
  // When WAITLIST_ENABLED=false or not set: normal functionality with artist search and sign-up
  waitlistEnabled: process.env.NEXT_PUBLIC_WAITLIST_ENABLED === 'true',
  // Artist search is enabled when waitlist mode is disabled
  artistSearchEnabled: process.env.NEXT_PUBLIC_WAITLIST_ENABLED !== 'true',
};
export const LEGAL = {
  privacyPath: '/legal/privacy',
  termsPath: '/legal/terms',
};

export const COPYRIGHT_YEAR = new Date().getFullYear();
export const getCopyrightText = () => `© ${COPYRIGHT_YEAR} ${APP_NAME}`;

export const SOCIAL_PLATFORMS = [
  'instagram',
  'twitter',
  'tiktok',
  'youtube',
  'facebook',
  'website',
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type DSP = keyof typeof DSPS;
