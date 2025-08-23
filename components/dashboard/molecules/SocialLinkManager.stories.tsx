import type { Meta, StoryObj } from '@storybook/react';
import { SocialLinkManager } from './SocialLinkManager';
import { detectPlatform } from '@/lib/utils/platform-detection';

// Mock data for social links
const mockSocialLinks = [
  {
    ...detectPlatform('https://instagram.com/artistname'),
    id: 'link_1',
    title: 'Instagram (@artistname)',
    isVisible: true,
    order: 0,
  },
  {
    ...detectPlatform('https://twitter.com/artistname'),
    id: 'link_2',
    title: 'X (Twitter) (@artistname)',
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

const meta: Meta<typeof SocialLinkManager> = {
  title: 'Dashboard/Molecules/SocialLinkManager',
  component: SocialLinkManager,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    initialLinks: {
      control: 'object',
      description: 'Initial social links to display',
    },
    onLinksChange: {
      action: 'links changed',
      description: 'Callback when links are added, updated, or removed',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    maxLinks: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of links allowed',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with initial links
export const Default: Story = {
  args: {
    initialLinks: mockSocialLinks,
    disabled: false,
    maxLinks: 10,
  },
};

// Empty state with no initial links
export const Empty: Story = {
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 10,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    initialLinks: mockSocialLinks,
    disabled: true,
    maxLinks: 10,
  },
};

// Limited links
export const LimitedLinks: Story = {
  args: {
    initialLinks: mockSocialLinks,
    disabled: false,
    maxLinks: 3,
  },
};

// Validation errors (mock implementation)
export const ValidationErrors: Story = {
  render: (args) => {
    // This is a render function to demonstrate validation errors
    // In a real scenario, these would be triggered by user input
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Validation Error Demo</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This story demonstrates how validation errors would appear when
            adding invalid links. In a real scenario, try pasting invalid URLs
            like:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <li>
              Invalid URL format: <code>not-a-url</code>
            </li>
            <li>
              Invalid Instagram URL:{' '}
              <code>https://instagram.com/user/extra/path</code>
            </li>
            <li>
              Invalid Twitter URL:{' '}
              <code>https://twitter.com/search?q=query</code>
            </li>
          </ul>
        </div>

        <SocialLinkManager {...args} />
      </div>
    );
  },
  args: {
    initialLinks: [],
    disabled: false,
    maxLinks: 10,
  },
};

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    initialLinks: mockSocialLinks,
    disabled: false,
    maxLinks: 10,
  },
};

// Interactive demo
export const Interactive: Story = {
  render: (args) => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Try the following actions:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <li>
              Add a new social link by pasting a URL (e.g.,{' '}
              <code>https://tiktok.com/@username</code>)
            </li>
            <li>Edit a link title by clicking on it</li>
            <li>Toggle visibility with the eye icon</li>
            <li>Delete a link with the trash icon</li>
            <li>Reorder links by dragging them</li>
          </ul>
        </div>

        <SocialLinkManager {...args} />
      </div>
    );
  },
  args: {
    initialLinks: mockSocialLinks,
    disabled: false,
    maxLinks: 10,
  },
};
