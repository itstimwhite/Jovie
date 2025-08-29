import { ToastProvider } from '@/components/providers/ToastProvider';
import type { Meta, StoryObj } from '@storybook/react';
import { TipLinkCard } from './TipLinkCard';
import { Artist } from '@/types/db';

// Mock the getBaseUrl function for Storybook
import * as platformDetection from '@/lib/utils/platform-detection';
// @ts-ignore - Storybook mock
platformDetection.getBaseUrl = () => 'https://jov.ie';

const meta: Meta<typeof TipLinkCard> = {
  title: 'Tipping/TipLinkCard',
  component: TipLinkCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ width: '500px' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TipLinkCard>;

const baseArtist: Artist = {
  id: '123',
  owner_user_id: 'user123',
  handle: 'artistname',
  spotify_id: '',
  name: 'Artist Name',
  published: true,
  is_verified: false,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

export const Default: Story = {
  args: {
    artist: baseArtist,
  },
};

export const LongHandle: Story = {
  args: {
    artist: {
      ...baseArtist,
      id: '456',
      handle: 'very-long-artist-handle-that-might-overflow',
      name: 'Long Handle Artist',
    },
  },
};

export const EmptyHandle: Story = {
  args: {
    artist: {
      ...baseArtist,
      id: '789',
      handle: '',
      name: 'No Handle Artist',
    },
  },
};

