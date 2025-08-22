import type { Meta, StoryObj } from '@storybook/react';
import { SocialBar } from './SocialBar';
import type { LegacySocialLink } from '@/types/db';

const meta: Meta<typeof SocialBar> = {
  title: 'Organisms/SocialBar',
  component: SocialBar,
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    handle: {
      control: { type: 'text' },
      description: 'Artist handle/username',
    },
    artistName: {
      control: { type: 'text' },
      description: 'Display name of the artist',
    },
    socialLinks: {
      control: { type: 'object' },
      description: 'Array of social media links',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock social links data
const createMockSocialLink = (
  id: string,
  platform: string,
  url: string
): LegacySocialLink => ({
  id,
  artist_id: 'mock-artist-id',
  platform,
  url,
  clicks: Math.floor(Math.random() * 1000),
  created_at: new Date().toISOString(),
});

const mockSocialLinksVariety: LegacySocialLink[] = [
  createMockSocialLink('1', 'spotify', 'https://spotify.com/artist/taylorswift'),
  createMockSocialLink('2', 'apple', 'https://music.apple.com/artist/taylorswift'),
  createMockSocialLink('3', 'youtube', 'https://youtube.com/@taylorswift'),
  createMockSocialLink('4', 'instagram', 'https://instagram.com/taylorswift'),
  createMockSocialLink('5', 'tiktok', 'https://tiktok.com/@taylorswift'),
];

const mockSocialLinksMinimal: LegacySocialLink[] = [
  createMockSocialLink('1', 'spotify', 'https://spotify.com/artist/artist'),
  createMockSocialLink('2', 'instagram', 'https://instagram.com/artist'),
];

const mockSocialLinksMusic: LegacySocialLink[] = [
  createMockSocialLink('1', 'spotify', 'https://spotify.com/artist/artist'),
  createMockSocialLink('2', 'apple', 'https://music.apple.com/artist/artist'),
  createMockSocialLink('3', 'youtube', 'https://youtube.com/@artist'),
  createMockSocialLink('4', 'soundcloud', 'https://soundcloud.com/artist'),
];

const mockSocialLinksCustom: LegacySocialLink[] = [
  createMockSocialLink('1', 'website', 'https://artist.com'),
  createMockSocialLink('2', 'discord', 'https://discord.gg/artist'),
  createMockSocialLink('3', 'patreon', 'https://patreon.com/artist'),
  createMockSocialLink('4', 'twitch', 'https://twitch.tv/artist'),
];

const mockSocialLinksMany: LegacySocialLink[] = [
  createMockSocialLink('1', 'spotify', 'https://spotify.com/artist/artist'),
  createMockSocialLink('2', 'apple', 'https://music.apple.com/artist/artist'),
  createMockSocialLink('3', 'youtube', 'https://youtube.com/@artist'),
  createMockSocialLink('4', 'instagram', 'https://instagram.com/artist'),
  createMockSocialLink('5', 'tiktok', 'https://tiktok.com/@artist'),
  createMockSocialLink('6', 'twitter', 'https://twitter.com/artist'),
  createMockSocialLink('7', 'facebook', 'https://facebook.com/artist'),
  createMockSocialLink('8', 'soundcloud', 'https://soundcloud.com/artist'),
  createMockSocialLink('9', 'bandcamp', 'https://artist.bandcamp.com'),
  createMockSocialLink('10', 'discord', 'https://discord.gg/artist'),
];

export const Default: Story = {
  args: {
    handle: 'taylorswift',
    artistName: 'Taylor Swift',
    socialLinks: mockSocialLinksVariety,
  },
};

export const EmptyState: Story = {
  args: {
    handle: 'newartist',
    artistName: 'New Artist',
    socialLinks: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'When no social links are provided, the component is hidden completely using the `hidden` class.',
      },
    },
  },
};

export const MinimalLinks: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksMinimal,
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal configuration with just two social links.',
      },
    },
  },
};

export const MusicPlatforms: Story = {
  args: {
    handle: 'musician',
    artistName: 'Musical Artist',
    socialLinks: mockSocialLinksMusic,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcasing music streaming platforms (Spotify, Apple Music, YouTube, SoundCloud).',
      },
    },
  },
};

export const CustomPlatforms: Story = {
  args: {
    handle: 'creator',
    artistName: 'Content Creator',
    socialLinks: mockSocialLinksCustom,
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternative platforms and custom links (Website, Discord, Patreon, Twitch).',
      },
    },
  },
};

export const ManyLinks: Story = {
  args: {
    handle: 'influencer',
    artistName: 'Social Influencer',
    socialLinks: mockSocialLinksMany,
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing responsive behavior with many social links. Links will wrap naturally using flexbox.',
      },
    },
  },
};

export const ResponsiveMobile: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksMany,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile viewport showing how links stack and wrap on smaller screens.',
      },
    },
  },
};

export const ResponsiveTablet: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksMany,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet viewport showing intermediate responsive behavior.',
      },
    },
  },
};

export const ResponsiveDesktop: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksMany,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop viewport showing full width layout with all links in a row.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksVariety,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <div className="p-8 min-h-[200px] flex items-center justify-center bg-gray-900">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const LightTheme: Story = {
  args: {
    handle: 'artist',
    artistName: 'Artist Name',
    socialLinks: mockSocialLinksVariety,
  },
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f9fafb' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 min-h-[200px] flex items-center justify-center bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export const InteractiveControls: Story = {
  args: {
    handle: 'customartist',
    artistName: 'Custom Artist',
    socialLinks: mockSocialLinksVariety,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls panel to modify the artist handle, name, and social links array to test different configurations.',
      },
    },
  },
};