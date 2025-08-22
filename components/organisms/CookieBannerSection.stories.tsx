import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CookieBannerSection } from './CookieBannerSection';

// Story wrapper to control visibility and consent states
const CookieBannerWrapper = ({
  isVisible = true,
  consentState = 'pending',
  headline = 'We use cookies to improve your experience.',
  acceptButtonLabel = 'Accept All',
  rejectButtonLabel = 'Reject Non-Essential',
  customizeButtonLabel = 'Customize',
}: {
  isVisible?: boolean;
  consentState?: 'pending' | 'granted' | 'denied';
  headline?: string;
  acceptButtonLabel?: string;
  rejectButtonLabel?: string;
  customizeButtonLabel?: string;
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [currentConsent, setCurrentConsent] = useState(consentState);

  // Mock the component with our controls
  const MockCookieBannerSection = () => {
    if (!visible || currentConsent !== 'pending') {
      return (
        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
          {currentConsent === 'granted' && 'Cookies accepted - banner hidden'}
          {currentConsent === 'denied' && 'Cookies rejected - banner hidden'}
          {!visible && currentConsent === 'pending' && 'Banner manually hidden'}
        </div>
      );
    }

    return (
      <div
        data-testid="cookie-banner"
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-2 bg-gray-100 p-4 text-gray-900 shadow md:flex-row md:items-center md:justify-between dark:bg-gray-800 dark:text-gray-100"
      >
        <p className="text-sm">{headline}</p>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {
              setCurrentConsent('denied');
              setVisible(false);
            }}
            className="rounded border px-3 py-2 text-sm border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {rejectButtonLabel}
          </button>
          <button
            onClick={() => {
              // In real component this opens modal, here we just show message
              alert('Customize modal would open here');
            }}
            className="rounded border px-3 py-2 text-sm border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {customizeButtonLabel}
          </button>
          <button
            onClick={() => {
              setCurrentConsent('granted');
              setVisible(false);
            }}
            className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            {acceptButtonLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-[200px]">
      <div className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded">
        <p>
          <strong>Note:</strong> This is a Storybook demo of the cookie banner. 
          Current state: <strong>{currentConsent}</strong>
          {currentConsent === 'pending' && ' - Click buttons to change consent state'}
        </p>
        {currentConsent !== 'pending' && (
          <button
            onClick={() => {
              setCurrentConsent('pending');
              setVisible(true);
            }}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset Banner
          </button>
        )}
      </div>
      <MockCookieBannerSection />
    </div>
  );
};

const meta: Meta<typeof CookieBannerWrapper> = {
  title: 'Organisms/CookieBannerSection',
  component: CookieBannerWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Cookie consent banner that appears at the bottom of the screen with options to accept, reject, or customize cookie preferences.',
      },
    },
  },
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Whether the banner is initially visible',
      defaultValue: true,
    },
    consentState: {
      control: {
        type: 'select',
        options: ['pending', 'granted', 'denied'],
      },
      description: 'Current consent state',
      defaultValue: 'pending',
    },
    headline: {
      control: 'text',
      description: 'Main headline text',
      defaultValue: 'We use cookies to improve your experience.',
    },
    acceptButtonLabel: {
      control: 'text',
      description: 'Accept button label',
      defaultValue: 'Accept All',
    },
    rejectButtonLabel: {
      control: 'text',
      description: 'Reject button label',
      defaultValue: 'Reject Non-Essential',
    },
    customizeButtonLabel: {
      control: 'text',
      description: 'Customize button label',
      defaultValue: 'Customize',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - pending consent state
export const Default: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
  },
};

// Consent granted state
export const ConsentGranted: Story = {
  args: {
    isVisible: false,
    consentState: 'granted',
  },
};

// Consent denied state
export const ConsentDenied: Story = {
  args: {
    isVisible: false,
    consentState: 'denied',
  },
};

// Light theme story
export const LightTheme: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
  },
  decorators: [
    (Story) => (
      <div className="bg-white min-h-screen">
        <Story />
      </div>
    ),
  ],
};

// Dark theme story
export const DarkTheme: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-900 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

// Custom text content
export const CustomContent: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
    headline: 'We value your privacy and use cookies to enhance your browsing experience.',
    acceptButtonLabel: 'Accept Cookies',
    rejectButtonLabel: 'Decline',
    customizeButtonLabel: 'Manage Preferences',
  },
};

// Mobile viewport story
export const Mobile: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px', margin: '0 auto', minHeight: '667px' }}>
        <Story />
      </div>
    ),
  ],
};

// Mobile dark theme
export const MobileDark: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
  },
  decorators: [
    (Story) => (
      <div 
        className="dark bg-gray-900"
        style={{ width: '375px', margin: '0 auto', minHeight: '667px' }}
      >
        <Story />
      </div>
    ),
  ],
};

// Long text content to test responsive layout
export const LongContent: Story = {
  args: {
    isVisible: true,
    consentState: 'pending',
    headline: 'We use cookies and similar technologies to provide, protect and improve our products and services, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.',
    acceptButtonLabel: 'Accept All Cookies',
    rejectButtonLabel: 'Reject All Non-Essential',
    customizeButtonLabel: 'Customize Cookie Preferences',
  },
};