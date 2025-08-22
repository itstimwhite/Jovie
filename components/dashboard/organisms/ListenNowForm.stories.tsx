import type { Meta, StoryObj } from '@storybook/react';
import { ListenNowForm } from './ListenNowForm';
import { userEvent, within } from '@storybook/testing-library';

// Mock the Supabase hook
jest.mock('@/lib/supabase', () => ({
  useAuthenticatedSupabase: () => ({
    getAuthenticatedClient: () => ({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({
                data: {
                  id: 'artist123',
                  spotify_url: 'https://open.spotify.com/artist/updated',
                  apple_music_url: 'https://music.apple.com/artist/updated',
                  youtube_url: 'https://youtube.com/channel/updated',
                },
                error: null,
              }),
            }),
          }),
        }),
      }),
    }),
  }),
}));

const mockArtist = {
  id: 'artist123',
  name: 'Test Artist',
  spotify_url: 'https://open.spotify.com/artist/123456',
  apple_music_url: 'https://music.apple.com/artist/123456',
  youtube_url: 'https://youtube.com/channel/123456',
};

const meta: Meta<typeof ListenNowForm> = {
  title: 'Dashboard/Organisms/ListenNowForm',
  component: ListenNowForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
  args: {
    artist: mockArtist,
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Pristine state with all links
export const Pristine: Story = {};

// With some links
export const WithSomeLinks: Story = {
  args: {
    artist: {
      ...mockArtist,
      spotify_url: 'https://open.spotify.com/artist/123456',
      apple_music_url: '',
      youtube_url: 'https://youtube.com/channel/123456',
    },
  },
};

// Without any links
export const WithoutLinks: Story = {
  args: {
    artist: {
      ...mockArtist,
      spotify_url: '',
      apple_music_url: '',
      youtube_url: '',
    },
  },
};

// Loading/submitting state
export const Submitting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Change the Spotify URL
    const spotifyInput = canvas.getByPlaceholderText('https://open.spotify.com/artist/...');
    await userEvent.clear(spotifyInput);
    await userEvent.type(spotifyInput, 'https://open.spotify.com/artist/newartist', { delay: 100 });
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /update links/i });
    await userEvent.click(submitButton);
  },
};

// Success state
export const SuccessState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Change the Spotify URL
    const spotifyInput = canvas.getByPlaceholderText('https://open.spotify.com/artist/...');
    await userEvent.clear(spotifyInput);
    await userEvent.type(spotifyInput, 'https://open.spotify.com/artist/newartist', { delay: 100 });
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /update links/i });
    await userEvent.click(submitButton);
    
    // Wait for success message
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};

