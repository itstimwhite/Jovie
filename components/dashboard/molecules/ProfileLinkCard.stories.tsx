import type { Meta, StoryObj } from '@storybook/react';
import { ProfileLinkCard } from './ProfileLinkCard';
import { Artist } from '@/types/db';
import * as platformDetection from '@/lib/utils/platform-detection';

// Create a mock version of the component that uses a fixed base URL
function MockProfileLinkCard({ artist }: { artist: Artist }) {
  // Override the getBaseUrl function for Storybook
  const originalGetBaseUrl = platformDetection.getBaseUrl;
  platformDetection.getBaseUrl = () => 'https://jov.ie';

  // Render the component
  const result = <ProfileLinkCard artist={artist} />;

  // Restore the original function to avoid side effects
  platformDetection.getBaseUrl = originalGetBaseUrl;

  return result;
}

// Mock artist data for stories
const mockArtist: Artist = {
  id: '123',
  owner_user_id: 'user123',
  handle: 'artist-name',
  spotify_id: 'spotify123',
  name: 'Artist Name',
  image_url: 'https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Artist with a long name and handle
const mockArtistLong: Artist = {
  ...mockArtist,
  id: '456',
  handle: 'very-long-artist-name-that-might-wrap-on-smaller-screens',
  name: 'Very Long Artist Name That Might Wrap On Smaller Screens And Cause Layout Issues',
};

const meta: Meta<typeof MockProfileLinkCard> = {
  title: 'Dashboard/Molecules/ProfileLinkCard',
  component: MockProfileLinkCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      description: 'Artist data object',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockProfileLinkCard>;

// Default story with standard artist data
export const Default: Story = {
  args: {
    artist: mockArtist,
  },
};

// Story with long artist name and handle to test text wrapping
export const WithLongText: Story = {
  args: {
    artist: mockArtistLong,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the component handles long artist names and handles that might wrap on smaller screens.',
      },
    },
  },
};

// Story with a narrow container to test responsive behavior
export const NarrowContainer: Story = {
  args: {
    artist: mockArtist,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the component behaves in a narrow container, simulating mobile view.',
      },
    },
  },
};

// Story with both narrow container and long text
export const NarrowContainerWithLongText: Story = {
  args: {
    artist: mockArtistLong,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the component handles long text in a narrow container, testing the most challenging layout scenario.',
      },
    },
  },
};
