import { MetadataRoute } from 'next';
import { APP_NAME } from '@/constants/app';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'Jovie',
    description: 'Link in bio for music artists',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['music', 'entertainment', 'social'],
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/og/default.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Jovie - Link in bio for music artists',
      },
    ],
    shortcuts: [
      {
        name: 'Find Artist',
        short_name: 'Search',
        description: 'Search for an artist to claim their profile',
        url: '/',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
          },
        ],
      },
    ],
  };
}
