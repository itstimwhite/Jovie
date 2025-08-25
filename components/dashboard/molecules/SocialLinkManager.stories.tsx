import type { Meta, StoryObj } from '@storybook/react';
import { SocialLinkManager } from './SocialLinkManager';
import { detectPlatform } from '@/lib/utils/platform-detection';

// Pre-computed mock data for better performance
const MOCK_INSTAGRAM_LINK = {
  ...detectPlatform('https://instagram.com/artistname'),
  id: '1',
  title: 'Instagram',
  isVisible: true,
  order: 0,
};

const MOCK_TIKTOK_LINK = {
  ...detectPlatform('https://tiktok.com/@artistname'),
  id: '2',
  title: 'TikTok',
  isVisible: true,
  order: 1,
};

const MOCK_TWITTER_LINK = {
  ...detectPlatform('https://twitter.com/artistname'),
  id: '3',
  title: 'Twitter',
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

const MOCK_SPOTIFY_LINK = {
  ...detectPlatform('https://open.spotify.com/artist/123'),
  id: '5',
  title: 'Spotify',
  isVisible: true,
  order: 4,
};

const MOCK_APPLE_MUSIC_LINK = {
  ...detectPlatform('https://music.apple.com/artist/123'),
  id: '6',
  title: 'Apple Music',
  isVisible: true,
  order: 5,
};

// Optimized functions that return pre-computed links
const createMockSocialLinks = () => [
  MOCK_INSTAGRAM_LINK,
  MOCK_TIKTOK_LINK,
  MOCK_TWITTER_LINK,
  MOCK_YOUTUBE_LINK,
];

// Create mixed links (social + music) to demonstrate filtering
const createMixedLinks = () => [
  ...createMockSocialLinks(),
  MOCK_SPOTIFY_LINK,
  MOCK_APPLE_MUSIC_LINK,
];

const meta: Meta<typeof SocialLinkManager> = {
  title: 'Dashboard/Molecules/SocialLinkManager',
  component: SocialLinkManager,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A specialized version of the LinkManager component that only allows social media links.',
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
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of social links allowed',
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
    maxLinks: 10,
  },
};

// With initial social links
export const WithSocialLinks: Story = {
  args: {
    initialLinks: createMockSocialLinks(),
    disabled: false,
    maxLinks: 10,
  },
};

// With mixed links (should filter out non-social)
export const WithMixedLinks: Story = {
  args: {
    initialLinks: createMixedLinks(),
    disabled: false,
    maxLinks: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When provided with a mix of social and non-social links, the SocialLinkManager will filter out non-social links.',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    initialLinks: createMockSocialLinks(),
    disabled: true,
    maxLinks: 10,
  },
};

// Limited max links
export const LimitedLinks: Story = {
  args: {
    initialLinks: createMockSocialLinks(),
    disabled: false,
    maxLinks: 5,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 10,
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: () => {
    const mockLinks = createMockSocialLinks();
    return (
      <div className="grid grid-cols-1 gap-8">
        <div className="p-6 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Light Theme</h3>
          <SocialLinkManager
            initialLinks={mockLinks}
            onLinksChange={() => {}}
            maxLinks={10}
          />
        </div>
        <div className="p-6 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Dark Theme</h3>
          <div className="dark">
            <SocialLinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={10}
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
    const mockLinks = createMockSocialLinks();
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Desktop View</h3>
          <div className="w-full">
            <SocialLinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={10}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tablet View</h3>
          <div className="w-[768px] mx-auto">
            <SocialLinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={10}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile View</h3>
          <div className="w-[375px] mx-auto">
            <SocialLinkManager
              initialLinks={mockLinks}
              onLinksChange={() => {}}
              maxLinks={10}
            />
          </div>
        </div>
      </div>
    );
  },
};
