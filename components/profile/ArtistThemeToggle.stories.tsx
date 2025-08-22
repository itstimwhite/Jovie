import type { Meta, StoryObj } from '@storybook/react';
import { ArtistThemeToggle } from './ArtistThemeToggle';
import { ArtistThemeProvider } from './ArtistThemeProvider';
import { Artist } from '@/types/db';

// Mock artist data
const mockArtist: Artist = {
  id: '1',
  owner_user_id: 'user_123',
  handle: 'artist',
  spotify_id: '',
  name: 'Artist Name',
  published: true,
  is_verified: false,
  is_featured: false,
  marketing_opt_out: false,
  created_at: new Date().toISOString(),
  theme: { mode: 'auto' }
};

// Wrapper component to provide artist theme context
const ArtistThemeToggleWithProvider = () => (
  <ArtistThemeProvider artist={mockArtist}>
    <div className="p-4 flex items-center justify-center">
      <ArtistThemeToggle />
    </div>
  </ArtistThemeProvider>
);

const meta: Meta<typeof ArtistThemeToggle> = {
  title: 'Profile/ArtistThemeToggle',
  component: ArtistThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle component for switching between light and dark themes on artist profiles.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  render: () => <ArtistThemeToggleWithProvider />,
};

export default meta;
type Story = StoryObj<typeof ArtistThemeToggle>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default artist theme toggle that switches between light and dark themes.',
      },
    },
  },
};

