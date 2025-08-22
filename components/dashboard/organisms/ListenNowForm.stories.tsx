import type { Meta, StoryObj } from '@storybook/react';
import { ListenNowForm } from './ListenNowForm';
import { Artist } from '@/types/db';
import { fn } from '@storybook/test';

// Create a mock artist for our stories
const mockArtist: Artist = {
  id: 'artist-123',
  owner_user_id: 'user-123',
  handle: 'artisthandle',
  spotify_id: 'spotify-123',
  name: 'Artist Name',
  image_url: 'https://placekitten.com/200/200',
  tagline: 'Artist tagline',
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
  },
  settings: {
    hide_branding: false,
  },
  spotify_url: 'https://open.spotify.com/artist/1234567890',
  apple_music_url: 'https://music.apple.com/artist/1234567890',
  youtube_url: 'https://youtube.com/channel/UC1234567890',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Create variants of the mock artist for different states
const artistWithPartialData: Artist = {
  ...mockArtist,
  spotify_url: 'https://open.spotify.com/artist/1234567890',
  apple_music_url: '',
  youtube_url: '',
};

const artistWithEmptyData: Artist = {
  ...mockArtist,
  spotify_url: '',
  apple_music_url: '',
  youtube_url: '',
};

const meta: Meta<typeof ListenNowForm> = {
  title: 'Dashboard/Organisms/ListenNowForm',
  component: ListenNowForm,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#1e293b' },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    artist: {
      control: 'object',
      description: 'Artist data object containing music platform URLs',
    },
    onUpdate: {
      action: 'onUpdate',
      description: 'Callback when artist data is updated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with all fields populated
export const Default: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
};

// Story with partial data (some fields empty)
export const PartialData: Story = {
  args: {
    artist: artistWithPartialData,
    onUpdate: fn(),
  },
};

// Story with empty data (all fields empty)
export const EmptyData: Story = {
  args: {
    artist: artistWithEmptyData,
    onUpdate: fn(),
  },
};

// Story demonstrating loading state
export const LoadingState: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  play: async ({ canvasElement }) => {
    // Find the form and submit it to show loading state
    const form = canvasElement.querySelector('form') as HTMLFormElement;
    if (form) {
      // Simulate form submission to trigger loading state
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.click();
      }
    }
  },
};

// Story demonstrating validation errors
export const ValidationError: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  play: async ({ canvasElement }) => {
    // Find the Spotify URL input and enter an invalid URL
    const spotifyInput = canvasElement.querySelector('input[placeholder*="spotify"]') as HTMLInputElement;
    if (spotifyInput) {
      spotifyInput.value = 'invalid-url';
      spotifyInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Submit the form to trigger validation
      const form = canvasElement.querySelector('form') as HTMLFormElement;
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  },
};

// Story with success state
export const SuccessState: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  play: async ({ canvasElement }) => {
    // Simulate successful form submission
    const form = canvasElement.querySelector('form') as HTMLFormElement;
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        // First click to submit
        submitButton.click();
        
        // Wait a bit then simulate success by calling onUpdate
        setTimeout(() => {
          const updatedArtist = {
            ...mockArtist,
            spotify_url: 'https://open.spotify.com/artist/updated',
          };
          // The success state will be shown automatically after form submission
        }, 1000);
      }
    }
  },
};

// Story with dark theme
export const DarkTheme: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

// Story with mobile viewport to test responsive layout
export const MobileView: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Story with tablet viewport
export const TabletView: Story = {
  args: {
    artist: mockArtist,
    onUpdate: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Interactive story for manual testing
export const Interactive: Story = {
  args: {
    artist: artistWithEmptyData,
    onUpdate: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version where you can fill out the form and test functionality manually.',
      },
    },
  },
};