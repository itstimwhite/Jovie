import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm } from './ProfileForm';
import { Artist } from '@/types/db';

// Create a mock artist for the stories
const mockArtist: Artist = {
  id: 'mock-artist-id',
  owner_user_id: 'mock-user-id',
  handle: 'artisthandle',
  spotify_id: 'spotify123',
  name: 'Artist Name',
  image_url: 'https://via.placeholder.com/150',
  tagline: 'This is a sample artist tagline',
  settings: {
    hide_branding: false,
  },
  spotify_url: 'https://spotify.com/artist/spotify123',
  apple_music_url: 'https://music.apple.com/artist/apple123',
  youtube_url: 'https://youtube.com/channel/youtube123',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Mock the dependencies
// In a real Storybook setup, you would use proper mocking techniques
// like msw or mockServiceWorker. This is a simplified version for demonstration.

const meta: Meta<typeof ProfileForm> = {
  title: 'Dashboard/Organisms/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      control: 'object',
      description: 'Artist profile data',
    },
    onUpdate: {
      action: 'updated',
      description: 'Callback when profile is updated',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileForm>;

// Default story
export const Default: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
};

// Story with empty fields
export const EmptyFields: Story = {
  args: {
    artist: {
      ...mockArtist,
      name: '',
      tagline: '',
      image_url: '',
    },
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
};

// Story with branding toggle enabled
export const WithBrandingToggle: Story = {
  args: {
    artist: {
      ...mockArtist,
      settings: {
        hide_branding: true,
      },
    },
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
};

// Story with dark mode
export const DarkMode: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Story with mobile viewport
export const MobileView: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
