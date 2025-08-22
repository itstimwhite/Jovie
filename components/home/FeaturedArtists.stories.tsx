import type { Meta, StoryObj } from '@storybook/react';
import { FeaturedArtistsSection } from '@/components/organisms/FeaturedArtistsSection';

// We're creating stories for the FeaturedArtistsSection component since FeaturedArtists
// is a server component that fetches data and renders FeaturedArtistsSection

const meta: Meta<typeof FeaturedArtistsSection> = {
  title: 'Home/Organisms/FeaturedArtists',
  component: FeaturedArtistsSection,
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
    src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
  },
  {
    id: '2',
    handle: 'janedoe',
    name: 'Jane Doe',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
  },
  {
    id: '3',
    handle: 'bobsmith',
    name: 'Bob Smith',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
  },
  {
    id: '4',
    handle: 'alicejones',
    name: 'Alice Jones',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
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
      ...mockArtists.map((artist, index) => ({
        ...artist,
        id: `more-${index}`,
        handle: `${artist.handle}-more-${index}`,
      })),
    ],
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
