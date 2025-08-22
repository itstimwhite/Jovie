import type { Meta, StoryObj } from '@storybook/react';
import { DSPLinkManager } from './DSPLinkManager';
import { detectPlatform } from '@/lib/utils/platform-detection';
import type { DetectedLink } from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

const meta: Meta<typeof DSPLinkManager> = {
  title: 'Dashboard/Molecules/DSPLinkManager',
  component: DSPLinkManager,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables all interactions with the component',
    },
    maxLinks: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of DSP links allowed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample DSP links for stories
const sampleDSPLinks: LinkItem[] = [
  {
    ...detectPlatform('https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'),
    id: 'link_1',
    title: 'Spotify Artist',
    isVisible: true,
    order: 0,
  },
  {
    ...detectPlatform('https://music.apple.com/us/artist/radiohead/657515'),
    id: 'link_2',
    title: 'Apple Music',
    isVisible: true,
    order: 1,
  },
  {
    ...detectPlatform('https://soundcloud.com/radiohead'),
    id: 'link_3',
    title: 'SoundCloud',
    isVisible: true,
    order: 2,
  },
];

// Sample mixed links (DSP and social) to test filtering
const mixedLinks: LinkItem[] = [
  ...sampleDSPLinks,
  {
    ...detectPlatform('https://instagram.com/radiohead'),
    id: 'link_4',
    title: 'Instagram',
    isVisible: true,
    order: 3,
  },
  {
    ...detectPlatform('https://twitter.com/radiohead'),
    id: 'link_5',
    title: 'Twitter',
    isVisible: true,
    order: 4,
  },
];

// Mock function for onLinksChange
const onLinksChange = (links: LinkItem[]) => {
  console.log('Links changed:', links);
};

export const Empty: Story = {
  args: {
    initialLinks: [],
    onLinksChange,
  },
};

export const WithDSPLinks: Story = {
  args: {
    initialLinks: sampleDSPLinks,
    onLinksChange,
  },
};

export const WithMixedLinks: Story = {
  args: {
    initialLinks: mixedLinks,
    onLinksChange,
  },
  parameters: {
    docs: {
      description: {
        story: 'When mixed links are provided, only DSP links will be displayed due to filtering.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    initialLinks: sampleDSPLinks,
    onLinksChange,
    disabled: true,
  },
};

export const LimitedLinks: Story = {
  args: {
    initialLinks: sampleDSPLinks,
    onLinksChange,
    maxLinks: 3,
  },
};

