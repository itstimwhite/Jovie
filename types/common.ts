import { SocialPlatform, DSP } from '@/constants/app';

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: 'album' | 'single' | 'compilation';
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

export interface OnboardingData {
  spotifyUrl: string;
  handle: string;
}

export interface ProfileFormData {
  tagline: string;
  image_url?: string;
}

export interface SocialLinkFormData {
  platform: SocialPlatform;
  url: string;
}

export interface AnalyticsData {
  totalClicks: number;
  listenClicks: number;
  socialClicks: number;
  linkBreakdown: Array<{
    type: 'listen' | 'social';
    target: string;
    clicks: number;
  }>;
}