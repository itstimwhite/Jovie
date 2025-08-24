import type { Meta, StoryObj } from '@storybook/react';
import { ProfileLinkCard } from './ProfileLinkCard';
import { Artist } from '@/types/db';

// Mock artist data for stories
const mockArtist: Artist = {
  id: '1',
  user_id: 'user_123',
  handle: 'artistname',
  display_name: 'Artist Name',
  bio: 'This is a sample artist bio',
  avatar_url: 'https://via.placeholder.com/150',
  header_url: null,
  creator_type: 'musician',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  spotify_id: 'spotify_123',
  spotify_url: 'https://open.spotify.com/artist/123',
  links: [],
};

const meta: Meta<typeof ProfileLinkCard> = {
  title: 'Dashboard/Molecules/ProfileLinkCard',
  component: ProfileLinkCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A card component that displays the artist's profile link with copy and view functionality.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      control: 'object',
      description: 'The artist object containing profile information',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the ProfileLinkCard with a sample artist.',
      },
    },
  },
};

// Artist with a long handle
export const LongHandle: Story = {
  args: {
    artist: {
      ...mockArtist,
      handle: 'very-long-artist-handle-that-might-overflow',
      display_name: 'Artist With Long Handle',
    },
  },
};

// Artist with a long display name
export const LongDisplayName: Story = {
  args: {
    artist: {
      ...mockArtist,
      handle: 'artist',
      display_name:
        'This Is A Very Long Artist Name That Might Cause Layout Issues',
    },
  },
};

// Artist without avatar
export const WithoutAvatar: Story = {
  args: {
    artist: {
      ...mockArtist,
      avatar_url: null,
    },
  },
};

// Responsive layout demonstration
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Desktop View</h3>
        <div className="w-full">
          <ProfileLinkCard artist={mockArtist} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Tablet View</h3>
        <div className="w-[768px] mx-auto">
          <ProfileLinkCard artist={mockArtist} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Mobile View</h3>
        <div className="w-[375px] mx-auto">
          <ProfileLinkCard artist={mockArtist} />
        </div>
      </div>
    </div>
  ),
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Light Theme</h3>
        <ProfileLinkCard artist={mockArtist} />
      </div>
      <div className="p-6 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Dark Theme</h3>
        <div className="dark">
          <ProfileLinkCard artist={mockArtist} />
        </div>
      </div>
    </div>
  ),
};
