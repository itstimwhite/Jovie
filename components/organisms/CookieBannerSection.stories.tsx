import type { Meta, StoryObj } from '@storybook/react';
import { CookieBannerSection } from './CookieBannerSection';

const meta: Meta<typeof CookieBannerSection> = {
  title: 'Organisms/CookieBannerSection',
  component: CookieBannerSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative min-h-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock the window.JVConsent object for Storybook
if (typeof window !== 'undefined' && typeof window.JVConsent === 'undefined') {
  const listeners = new Set<(v: unknown) => void>();
  window.JVConsent = {
    onChange(cb: (v: unknown) => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    _emit(value: unknown) {
      listeners.forEach((l) => l(value));
    },
  };
}

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'The default cookie banner that appears at the bottom of the page, allowing users to accept, reject, or customize cookie preferences.',
      },
    },
  },
};

export const LightMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Cookie banner in light mode.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Cookie banner in dark mode with proper contrast.',
      },
    },
    className: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="dark relative min-h-[300px]">
        <Story />
      </div>
    ),
  ],
};

export const CustomizedContent: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Cookie banner with customized content through component props.',
      },
    },
  },
  render: () => {
    // This is a render function that allows us to customize the component
    // In a real implementation, we would pass props to customize the content
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-2 bg-gray-100 p-4 text-gray-900 shadow md:flex-row md:items-center md:justify-between dark:bg-gray-800 dark:text-gray-100">
        <div>
          <p className="text-sm font-medium">Cookie Preferences</p>
          <p className="text-sm">
            We use cookies to enhance your browsing experience and analyze our
            traffic.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {}}
            className="rounded border px-3 py-2 text-sm"
          >
            Decline
          </button>
          <button
            onClick={() => {}}
            className="rounded border px-3 py-2 text-sm"
          >
            Preferences
          </button>
          <button
            onClick={() => {}}
            className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Accept All
          </button>
        </div>
      </div>
    );
  },
};

export const WithCustomModal: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Cookie banner with the customize modal open.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // This simulates clicking the "Customize" button to open the modal
    const customizeButton = canvasElement.querySelector(
      'button:nth-child(2)'
    ) as HTMLButtonElement | null;
    if (customizeButton) {
      customizeButton.click();
    }
  },
};
