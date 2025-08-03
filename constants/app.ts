export const APP_NAME = 'Jovie';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://jov.ie';
export const MAX_SOCIAL_LINKS = 6;
export const LISTEN_COOKIE = 'jovie_dsp';
export const DSPS = { spotify: 'spotify' } as const;
export const DEFAULT_PROFILE_TAGLINE = 'Listen now.';
export const ANALYTICS = {
  segmentWriteKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY ?? '',
};

// Feature flags
export const FEATURE_FLAGS = {
  // Enable artist search in development and preview, disable in production
  artistSearchEnabled:
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview',
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
