import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { LinkManager } from './LinkManager';
import {
  detectPlatform,
  type DetectedLink,
} from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

// Sample links for stories
const sampleLinks: LinkItem[] = [
  {
    ...detectPlatform('https://open.spotify.com/artist/123'),
    id: 'link_1',
    title: 'Spotify Artist Profile',
    isVisible: true,
    order: 0,
  },
  {
    ...detectPlatform('https://instagram.com/artistname'),
    id: 'link_2',
    title: 'Instagram (@artistname)',
    isVisible: true,
    order: 1,
  },
  {
    ...detectPlatform('https://youtube.com/@artistchannel'),
    id: 'link_3',
    title: 'YouTube Channel',
    isVisible: true,
    order: 2,
  },
];

const meta: Meta<typeof LinkManager> = {
  title: 'Dashboard/Molecules/LinkManager',
  component: LinkManager,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
    },
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
      description: 'Restricts the types of links that can be added',
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

// Wrapper component to handle state
const LinkManagerWrapper = (args: React.ComponentProps<typeof LinkManager>) => {
  const [links, setLinks] = useState<LinkItem[]>(args.initialLinks || []);

  // Reset links when initialLinks changes (for story controls)
  useEffect(() => {
    setLinks(args.initialLinks || []);
  }, [args.initialLinks]);

  const handleLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    console.log('Links updated:', newLinks);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <LinkManager
        {...args}
        initialLinks={links}
        onLinksChange={handleLinksChange}
      />
    </div>
  );
};

export const Default: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: sampleLinks,
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
  },
};

export const EmptyState: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
  },
};

export const WithValidationError: Story = {
  render: (args) => {
    // This story demonstrates the validation error state
    // We'll use the component's built-in validation
    return (
      <div className="max-w-2xl mx-auto">
        <p className="mb-4 text-sm text-gray-500">
          Try pasting an invalid URL like &ldquo;not-a-url&rdquo; to see
          validation errors.
        </p>
        <LinkManagerWrapper {...args} />
      </div>
    );
  },
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
  },
};

export const DSPLinksOnly: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: [sampleLinks[0]],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'dsp',
    title: 'Music Platforms',
    description: 'Add your music streaming links',
  },
};

export const SocialLinksOnly: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: [sampleLinks[1], sampleLinks[2]],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'social',
    title: 'Social Media',
    description: 'Add your social media profiles',
  },
};

export const Disabled: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: sampleLinks,
    disabled: true,
    maxLinks: 20,
    allowedCategory: 'all',
  },
};

export const ReorderingDemo: Story = {
  render: (args) => {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="mb-4 text-sm text-gray-500">
          Try dragging the links to reorder them. The drag handle appears on
          hover.
          <br />
          You can also use keyboard navigation with Tab and Space/Enter to
          select and move items.
        </p>
        <LinkManagerWrapper {...args} />
      </div>
    );
  },
  args: {
    initialLinks: sampleLinks,
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
  },
};

export const MaxLinksReached: Story = {
  render: LinkManagerWrapper,
  args: {
    initialLinks: [
      ...sampleLinks,
      {
        ...detectPlatform('https://twitter.com/artistname'),
        id: 'link_4',
        title: 'Twitter (@artistname)',
        isVisible: true,
        order: 3,
      },
    ],
    disabled: false,
    maxLinks: 4,
    allowedCategory: 'all',
  },
};
