import type { Meta, StoryObj } from '@storybook/react';
import { LinkManager } from './LinkManager';
import { detectPlatform } from '@/lib/utils/platform-detection';

// Pre-computed mock data for better performance
const MOCK_SPOTIFY_LINK = {
  ...detectPlatform('https://open.spotify.com/artist/123'),
  id: '1',
  title: 'Spotify',
  isVisible: true,
  order: 0,
};

const MOCK_INSTAGRAM_LINK = {
  ...detectPlatform('https://instagram.com/artistname'),
  id: '2',
  title: 'Instagram',
  isVisible: true,
  order: 1,
};

const MOCK_TIKTOK_LINK = {
  ...detectPlatform('https://tiktok.com/@artistname'),
  id: '3',
  title: 'TikTok',
  isVisible: false,
  order: 2,
};

const MOCK_YOUTUBE_LINK = {
  ...detectPlatform('https://youtube.com/channel/123'),
  id: '4',
  title: 'YouTube',
  isVisible: true,
  order: 3,
};

// Optimized function that returns pre-computed links
const createMockLinks = () => [
  MOCK_SPOTIFY_LINK,
  MOCK_INSTAGRAM_LINK,
  MOCK_TIKTOK_LINK,
  MOCK_YOUTUBE_LINK,
];

const meta: Meta<typeof LinkManager> = {
  title: 'Dashboard/Molecules/LinkManager',
  component: LinkManager,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A component for managing links with drag-and-drop reordering, visibility toggling, and link addition/deletion.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialLinks: {
      control: 'object',
      description: 'Initial links to display in the manager',
    },
    onLinksChange: {
      action: 'linksChanged',
      description: 'Callback when links are added, removed, or reordered',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the link manager is disabled',
    },
    maxLinks: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Maximum number of links allowed',
    },
    allowedCategory: {
      control: { type: 'select', options: ['dsp', 'social', 'custom', 'all'] },
      description: 'Category of links allowed in this manager',
    },
    title: {
      control: 'text',
      description: 'Title for the link manager section',
    },
    description: {
      control: 'text',
      description: 'Description text for the link manager',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with no initial links
export const Default: Story = {
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
    title: 'Manage Links',
    description: 'Add and organize your links. Changes save automatically.',
  },
};

// With initial links
export const WithInitialLinks: Story = {
  args: {
    initialLinks: createMockLinks(),
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
    title: 'Manage Links',
    description: 'Add and organize your links. Changes save automatically.',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    initialLinks: createMockLinks(),
    disabled: true,
    maxLinks: 20,
    allowedCategory: 'all',
    title: 'Manage Links (Disabled)',
    description: 'This link manager is currently disabled.',
  },
};

// Limited max links
export const LimitedLinks: Story = {
  args: {
    initialLinks: createMockLinks(),
    disabled: false,
    maxLinks: 5,
    allowedCategory: 'all',
    title: 'Limited Links',
    description: 'This link manager is limited to 5 links maximum.',
  },
};

// Filtered by category (DSP only)
export const DSPLinksOnly: Story = {
  args: {
    initialLinks: createMockLinks(),
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'dsp',
    title: 'Music Platform Links',
    description: 'Add Spotify, Apple Music, and other music streaming links.',
  },
};

// Filtered by category (Social only)
export const SocialLinksOnly: Story = {
  args: {
    initialLinks: createMockLinks(),
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'social',
    title: 'Social Media Links',
    description:
      'Add Instagram, Twitter, TikTok, and other social media links.',
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 20,
    allowedCategory: 'all',
    title: 'Empty Link Manager',
    description: 'No links have been added yet.',
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: () => {
    const mockLinks = createMockLinks();
    return (
      <div className="grid grid-cols-1 gap-8">
        <div className="p-6 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Light Theme</h3>
          <LinkManager
            initialLinks={mockLinks}
            onLinksChange={() => {}}
            maxLinks={20}
            allowedCategory="all"
          />
        </div>
        <div className="p-6 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Dark Theme</h3>
          <div className="dark">
            <LinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={20}
              allowedCategory="all"
            />
          </div>
        </div>
      </div>
    );
  },
};

// Responsive layout demonstration
export const ResponsiveLayout: Story = {
  render: () => {
    const mockLinks = createMockLinks();
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Desktop View</h3>
          <div className="w-full">
            <LinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={20}
              allowedCategory="all"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tablet View</h3>
          <div className="w-[768px] mx-auto">
            <LinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={20}
              allowedCategory="all"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile View</h3>
          <div className="w-[375px] mx-auto">
            <LinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={20}
              allowedCategory="all"
            />
          </div>
        </div>
      </div>
    );
  },
};
