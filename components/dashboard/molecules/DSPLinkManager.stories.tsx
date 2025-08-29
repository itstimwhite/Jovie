import type { Meta, StoryObj } from '@storybook/react';
import { type DetectedLink, getPlatform } from '@/lib/utils/platform-detection';
import { DSPLinkManager } from './DSPLinkManager';

// Define LinkItem interface (matching DSPLinkManager component)
interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

// Mock data for DSP links
const mockDSPLinks = [
  {
    id: 'link_1',
    platform: getPlatform('spotify')!,
    normalizedUrl: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb',
    originalUrl: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb',
    suggestedTitle: 'Spotify Artist',
    title: 'Spotify',
    isValid: true,
    isVisible: true,
    order: 0,
  },
  {
    id: 'link_2',
    platform: getPlatform('apple-music')!,
    normalizedUrl: 'https://music.apple.com/artist/radiohead/657515',
    originalUrl: 'https://music.apple.com/artist/radiohead/657515',
    suggestedTitle: 'Apple Music Artist',
    title: 'Apple Music',
    isValid: true,
    isVisible: true,
    order: 1,
  },
  {
    id: 'link_3',
    platform: getPlatform('soundcloud')!,
    normalizedUrl: 'https://soundcloud.com/radiohead',
    originalUrl: 'https://soundcloud.com/radiohead',
    suggestedTitle: 'SoundCloud',
    title: 'SoundCloud',
    isValid: true,
    isVisible: true,
    order: 2,
  },
];

const meta: Meta<typeof DSPLinkManager> = {
  title: 'Dashboard/Molecules/DSPLinkManager',
  component: DSPLinkManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for managing DSP (Digital Service Provider) links like Spotify, Apple Music, etc.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialLinks: {
      description: 'Initial list of DSP links',
      control: 'object',
    },
    onLinksChange: {
      description: 'Callback when links are added, updated, or removed',
      action: 'links changed',
    },
    disabled: {
      description: 'Whether the component is disabled',
      control: 'boolean',
    },
  },
  decorators: [
    Story => (
      <div className='p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock the onLinksChange function
const mockOnLinksChange = (links: LinkItem[]) => {
  console.log('Links changed:', links);
};

export const Default: Story = {
  args: {
    initialLinks: mockDSPLinks,
    onLinksChange: mockOnLinksChange,
    disabled: false,
  },
};

export const Empty: Story = {
  args: {
    initialLinks: [],
    onLinksChange: mockOnLinksChange,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'DSPLinkManager with no initial links, showing the empty state.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    initialLinks: mockDSPLinks,
    onLinksChange: mockOnLinksChange,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DSPLinkManager in disabled state, preventing any modifications.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    initialLinks: mockDSPLinks,
    onLinksChange: mockOnLinksChange,
    disabled: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'DSPLinkManager in dark mode.',
      },
    },
  },
};
