import type { Meta, StoryObj } from '@storybook/react';
import { ArtistCarousel } from './ArtistCarousel';

const meta: Meta<typeof ArtistCarousel> = {
  title: 'Home/Organisms/ArtistCarousel',
  component: ArtistCarousel,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for artists
const mockArtists = [
  {
    id: '1',
    handle: 'johndoe',
    name: 'John Doe',
    image_url:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'Electronic Music Producer',
  },
  {
    id: '2',
    handle: 'janedoe',
    name: 'Jane Doe',
    image_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'Singer-Songwriter',
  },
  {
    id: '3',
    handle: 'bobsmith',
    name: 'Bob Smith',
    image_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'Guitarist',
  },
  {
    id: '4',
    handle: 'alicejones',
    name: 'Alice Jones',
    image_url:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'DJ & Producer',
  },
  {
    id: '5',
    handle: 'michaelbrown',
    name: 'Michael Brown',
    image_url:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'Drummer',
  },
  {
    id: '6',
    handle: 'sarahwilliams',
    name: 'Sarah Williams',
    image_url:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
    tagline: 'Vocalist',
  },
];

// Create artists with long names for testing text overflow
const longNameArtists = mockArtists.map((artist, index) => ({
  ...artist,
  id: `long-${index}`,
  name: `${artist.name} with a Very Very Long Name That Should Overflow`,
}));

export const WithData: Story = {
  args: {
    artists: mockArtists,
  },
};

export const Empty: Story = {
  args: {
    artists: [],
  },
};

export const WithLongNames: Story = {
  args: {
    artists: longNameArtists,
  },
};

export const WithManyArtists: Story = {
  args: {
    artists: [
      ...mockArtists,
      ...mockArtists.map((artist, index) => ({
        ...artist,
        id: `extra-${index}`,
        handle: `${artist.handle}-${index}`,
      })),
    ],
  },
};

export const WithMissingImages: Story = {
  args: {
    artists: mockArtists.map((artist, index) => ({
      ...artist,
      id: `missing-${index}`,
      image_url: index % 2 === 0 ? null : artist.image_url,
    })),
  },
};

export const DarkMode: Story = {
  args: {
    artists: mockArtists,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
  },
};
