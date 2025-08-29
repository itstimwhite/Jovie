import type { Meta, StoryObj } from '@storybook/react';
import { TipLinkCard } from './TipLinkCard';
import { ToastProvider } from '@/components/providers/ToastProvider';

// Mock the getBaseUrl function for Storybook
import * as platformDetection from '@/lib/utils/platform-detection';
jest.spyOn(platformDetection, 'getBaseUrl').mockReturnValue('https://jov.ie');

const meta: Meta<typeof TipLinkCard> = {
  title: 'Tipping/TipLinkCard',
  component: TipLinkCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
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

export const Default: Story = {
  args: {
    artist: {
      id: '123',
      handle: 'artistname',
      name: 'Artist Name',
    },
  },
};

export const LongHandle: Story = {
  args: {
    artist: {
      id: '456',
      handle: 'very-long-artist-handle-that-might-overflow',
      name: 'Long Handle Artist',
    },
  },
};

export const EmptyHandle: Story = {
  args: {
    artist: {
      id: '789',
      handle: '',
      name: 'No Handle Artist',
    },
  },
};
