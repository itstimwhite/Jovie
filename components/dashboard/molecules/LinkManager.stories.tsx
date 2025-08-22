import type { Meta, StoryObj } from '@storybook/react';
import { LinkManager } from './LinkManager';
import { detectPlatform } from '@/lib/utils/platform-detection';
import type { DetectedLink } from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

const meta: Meta<typeof LinkManager> = {
  title: 'Dashboard/Molecules/LinkManager',
  component: LinkManager,
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
      control: { type: 'number', min: 1, max: 50 },
      description: 'Maximum number of links allowed',
    },
    allowedCategory: {
      control: { type: 'select' },
      options: ['dsp', 'social', 'custom', 'all'],
      description: 'Filter links by category',
    },
    title: {
      control: 'text',
      description: 'Title for the link manager',
    },
    description: {
      control: 'text',
      description: 'Description text for the link manager',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample links for stories
const sampleLinks: LinkItem[] = [
  {
    ...detectPlatform('https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'),
    id: 'link_1',
    title: 'Spotify Artist',
    isVisible: true,
    order: 0,
  },
  {
    ...detectPlatform('https://instagram.com/radiohead'),
    id: 'link_2',
    title: 'Instagram',
    isVisible: true,
    order: 1,
  },
  {
    ...detectPlatform('https://twitter.com/radiohead'),
    id: 'link_3',
    title: 'Twitter',
    isVisible: false,
    order: 2,
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
    title: 'Manage Links',
    description: 'Add and organize your links. Changes save automatically.',
  },
};

export const WithLinks: Story = {
  args: {
    initialLinks: sampleLinks,
    onLinksChange,
    title: 'Manage Links',
    description: 'Add and organize your links. Changes save automatically.',
  },
};

export const Disabled: Story = {
  args: {
    initialLinks: sampleLinks,
    onLinksChange,
    disabled: true,
    title: 'Manage Links',
    description: 'Add and organize your links. Changes save automatically.',
  },
};

export const LimitedLinks: Story = {
  args: {
    initialLinks: sampleLinks,
    onLinksChange,
    maxLinks: 3,
    title: 'Limited Links',
    description: 'You can only add up to 3 links.',
  },
};

export const DSPOnly: Story = {
  args: {
    initialLinks: [sampleLinks[0]],
    onLinksChange,
    allowedCategory: 'dsp',
    title: 'Music Links Only',
    description: 'Only music streaming links are allowed.',
  },
};

export const SocialOnly: Story = {
  args: {
    initialLinks: [sampleLinks[1], sampleLinks[2]],
    onLinksChange,
    allowedCategory: 'social',
    title: 'Social Links Only',
    description: 'Only social media links are allowed.',
  },
};

