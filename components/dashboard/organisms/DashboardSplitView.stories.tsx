import type { Meta, StoryObj } from '@storybook/react';
import { Artist, CreatorProfile } from '@/types/db';
import { DashboardSplitView } from './DashboardSplitView';

// Mock data for the stories
const mockArtist: Artist = {
  id: 'artist-1',
  handle: 'artisthandle',
  name: 'Artist Name',
  spotify_id: '',
  owner_user_id: 'user-1',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: new Date().toISOString(),
  tagline:
    'This is a sample artist bio that describes the artist and their work.',
  image_url: 'https://via.placeholder.com/150',
  spotify_url: 'https://spotify.com/artist/example',
  apple_music_url: 'https://music.apple.com/artist/example',
  youtube_url: 'https://youtube.com/channel/example',
  theme: {
    primary_color: '#3b82f6',
    accent_color: '#10b981',
    background_color: '#ffffff',
    text_color: '#1f2937',
  },
  settings: {
    hide_branding: false,
  },
};

const mockCreatorProfile: CreatorProfile = {
  id: 'profile-1',
  user_id: 'user-1',
  creator_type: 'artist',
  username: 'artisthandle',
  display_name: 'Artist Name',
  bio: 'This is a sample artist bio that describes the artist and their work.',
  avatar_url: 'https://via.placeholder.com/150',
  spotify_url: 'https://spotify.com/artist/example',
  apple_music_url: 'https://music.apple.com/artist/example',
  youtube_url: 'https://youtube.com/channel/example',
  spotify_id: '',
  is_public: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  is_claimed: true,
  claim_token: null,
  claimed_at: new Date().toISOString(),
  profile_views: 0,
  username_normalized: 'artisthandle',
  search_text: 'Artist Name artisthandle',
  display_title: 'Artist Name',
  profile_completion_pct: 80,
  settings: {},
  theme: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const meta = {
  title: 'Dashboard/Organisms/DashboardSplitView',
  component: DashboardSplitView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the form elements are disabled',
    },
  },
  decorators: [
    Story => (
      <div className='p-6 max-w-7xl mx-auto'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardSplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story with default settings
export const Default: Story = {
  args: {
    artist: mockArtist,
    creatorProfile: mockCreatorProfile,
    onArtistUpdate: updatedArtist =>
      console.log('Artist updated:', updatedArtist),
    disabled: false,
  },
};

// Story showing the disabled state
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

// Story with dark mode
export const DarkMode: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    Story => (
      <div className='p-6 max-w-7xl mx-auto dark bg-gray-900 min-h-screen'>
        <Story />
      </div>
    ),
  ],
};

// Story with mobile viewport
export const MobileView: Story = {
  args: {
    ...Default.args,
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
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Story with desktop viewport
export const DesktopView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
