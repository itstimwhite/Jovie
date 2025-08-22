import type { Meta, StoryObj } from '@storybook/react';
import { SocialBar } from './SocialBar';
import type { LegacySocialLink } from '@/types/db';

const meta: Meta<typeof SocialBar> = {
  title: 'Organisms/SocialBar',
  component: SocialBar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    handle: {
      control: 'text',
      description: 'The artist handle/username',
    },
    artistName: {
      control: 'text',
      description: 'The artist display name',
    },
    socialLinks: {
      control: 'object',
      description: 'Array of social links to display',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for social links
const mockSocialLinks: LegacySocialLink[] = [
  {
    id: '1',
    artist_id: '1',
    platform: 'spotify',
    url: 'https://open.spotify.com/artist/1234',
    clicks: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    artist_id: '1',
    platform: 'apple',
    url: 'https://music.apple.com/artist/1234',
    clicks: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    artist_id: '1',
    platform: 'youtube',
    url: 'https://youtube.com/channel/1234',
    clicks: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    artist_id: '1',
    platform: 'instagram',
    url: 'https://instagram.com/artist',
    clicks: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    artist_id: '1',
    platform: 'twitter',
    url: 'https://twitter.com/artist',
    clicks: 0,
    created_at: new Date().toISOString(),
  },
];

// Default story with all social links
export const Default: Story = {
  args: {
    handle: 'artist',
    artistName: 'Amazing Artist',
    socialLinks: mockSocialLinks,
  },
};

// Story with only music platforms
export const MusicPlatformsOnly: Story = {
  args: {
    handle: 'musician',
    artistName: 'Music Artist',
    socialLinks: mockSocialLinks.filter((link) =>
      ['spotify', 'apple', 'youtube'].includes(link.platform)
    ),
  },
};

// Story with only social media platforms
export const SocialMediaOnly: Story = {
  args: {
    handle: 'influencer',
    artistName: 'Social Influencer',
    socialLinks: mockSocialLinks.filter((link) =>
      ['instagram', 'twitter'].includes(link.platform)
    ),
  },
};

// Story with a custom link
export const WithCustomLink: Story = {
  args: {
    handle: 'creator',
    artistName: 'Creative Artist',
    socialLinks: [
      ...mockSocialLinks.slice(0, 3),
      {
        id: '6',
        artist_id: '1',
        platform: 'website',
        url: 'https://artist-website.com',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
};

// Story with empty social links
export const EmptyState: Story = {
  args: {
    handle: 'newartist',
    artistName: 'New Artist',
    socialLinks: [],
  },
};

// Story with many social links to test wrapping
export const ManyLinks: Story = {
  args: {
    handle: 'popular',
    artistName: 'Popular Artist',
    socialLinks: [
      ...mockSocialLinks,
      {
        id: '6',
        artist_id: '1',
        platform: 'soundcloud',
        url: 'https://soundcloud.com/artist',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: '7',
        artist_id: '1',
        platform: 'bandcamp',
        url: 'https://artist.bandcamp.com',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: '8',
        artist_id: '1',
        platform: 'facebook',
        url: 'https://facebook.com/artist',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: '9',
        artist_id: '1',
        platform: 'discord',
        url: 'https://discord.gg/artist',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
};

// Story with dark mode
export const DarkMode: Story = {
  args: {
    handle: 'darkmode',
    artistName: 'Dark Mode Artist',
    socialLinks: mockSocialLinks,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="p-6 max-w-3xl mx-auto dark">
        <Story />
      </div>
    ),
  ],
};

// Story with responsive view (mobile)
export const MobileView: Story = {
  args: {
    handle: 'mobile',
    artistName: 'Mobile Artist',
    socialLinks: mockSocialLinks,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Story with responsive view (tablet)
export const TabletView: Story = {
  args: {
    handle: 'tablet',
    artistName: 'Tablet Artist',
    socialLinks: mockSocialLinks,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
