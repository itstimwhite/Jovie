/**
 * Spotify-specific fixtures for Storybook
 * 
 * This module provides mock data for Spotify-related components and stories.
 */

import { SpotifyArtist, SpotifyAlbum } from '@/types/common';

/**
 * Mock SpotifyArtist
 */
export const mockSpotifyArtist = (overrides?: Partial<SpotifyArtist>): SpotifyArtist => ({
  id: 'spotify_artist_id_123',
  name: 'Artist Name',
  images: [
    {
      url: 'https://i.scdn.co/image/ab6761610000e5ebexample1',
      height: 640,
      width: 640
    },
    {
      url: 'https://i.scdn.co/image/ab67616100005ebexample2',
      height: 320,
      width: 320
    },
    {
      url: 'https://i.scdn.co/image/ab6761610000f68dexample3',
      height: 160,
      width: 160
    }
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/artist/example'
  },
  popularity: 65,
  ...overrides
});

/**
 * Mock multiple SpotifyArtists
 */
export const mockSpotifyArtists = (count = 3, overrides?: Partial<SpotifyArtist>): SpotifyArtist[] => {
  const names = ['Taylor Swift', 'The Weeknd', 'Billie Eilish', 'Drake', 'Dua Lipa', 'Post Malone'];
  const popularities = [95, 88, 82, 90, 85, 87];
  
  return Array.from({ length: count }, (_, i) => mockSpotifyArtist({
    id: `spotify_artist_id_${i + 100}`,
    name: names[i % names.length],
    popularity: popularities[i % popularities.length],
    ...overrides
  }));
};

/**
 * Mock SpotifyAlbum
 */
export const mockSpotifyAlbum = (overrides?: Partial<SpotifyAlbum>): SpotifyAlbum => ({
  id: 'spotify_album_id_123',
  name: 'Album Title',
  album_type: 'album',
  release_date: '2023-05-15',
  release_date_precision: 'day',
  external_urls: {
    spotify: 'https://open.spotify.com/album/example'
  },
  images: [
    {
      url: 'https://i.scdn.co/image/ab67616d0000b273example1',
      height: 640,
      width: 640
    },
    {
      url: 'https://i.scdn.co/image/ab67616d00001e02example2',
      height: 300,
      width: 300
    },
    {
      url: 'https://i.scdn.co/image/ab67616d00004851example3',
      height: 64,
      width: 64
    }
  ],
  ...overrides
});

/**
 * Mock multiple SpotifyAlbums
 */
export const mockSpotifyAlbums = (count = 3, overrides?: Partial<SpotifyAlbum>): SpotifyAlbum[] => {
  const names = ['Debut Album', 'Sophomore Release', 'Greatest Hits', 'Live Sessions', 'Acoustic EP'];
  const types: ('album' | 'single' | 'compilation')[] = ['album', 'single', 'compilation'];
  const years = ['2023', '2022', '2021', '2020', '2019'];
  
  return Array.from({ length: count }, (_, i) => mockSpotifyAlbum({
    id: `spotify_album_id_${i + 100}`,
    name: names[i % names.length],
    album_type: types[i % types.length],
    release_date: `${years[i % years.length]}-${String(i % 12 + 1).padStart(2, '0')}-${String(i % 28 + 1).padStart(2, '0')}`,
    ...overrides
  }));
};

