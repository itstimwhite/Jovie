import type { Meta, StoryObj } from '@storybook/react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CookieModal from './CookieModal';
import { type Consent } from '@/lib/cookies/consent';

// Mock the saveConsent function since it's a server action
// and won't work in Storybook
// We'll use a mock implementation in the stories
const mockSaveConsent = async (consent: Consent) => {
  console.log('Mock saveConsent called with:', consent);
  return Promise.resolve();
};

const meta: Meta<typeof CookieModal> = {
  title: 'Components/CookieModal',
  component: CookieModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Cookie consent modal for managing user cookie preferences.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Ensure focus is trapped in modal
            id: 'focus-trap',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the modal is closed',
    },
    onSave: {
      action: 'saved',
      description: 'Callback when preferences are saved',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story with controls
export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('Modal closed'),
    onSave: (consent) => console.log('Consent saved:', consent),
  },
};

// Light theme story
export const LightTheme: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

// Dark theme story
export const DarkTheme: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// Initial state (no decision)
export const InitialState: Story = {
  args: {
    ...Default.args,
  },
};

// Accepted state
export const AcceptedState: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setSettings] = useState<Consent>({
      essential: true,
      analytics: true,
      marketing: true,
    });

    return (
      <CookieModal
        {...args}
        onSave={(consent) => {
          args.onSave?.(consent);
          setSettings(consent);
        }}
      />
    );
  },
  args: {
    ...Default.args,
  },
};

// Declined state
export const DeclinedState: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setSettings] = useState<Consent>({
      essential: true,
      analytics: false,
      marketing: false,
    });

    return (
      <CookieModal
        {...args}
        onSave={(consent) => {
          args.onSave?.(consent);
          setSettings(consent);
        }}
      />
    );
  },
  args: {
    ...Default.args,
  },
};

// Long localized copy to test overflow
export const LongLocalizedCopy: Story = {
  render: (args) => {
    // Create a custom version of CookieModal with long text
    const LongTextCookieModal = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [settings, setSettings] = useState<Consent>({
        essential: true,
        analytics: false,
        marketing: false,
      });

      const toggle = (key: keyof Consent) => {
        if (key === 'essential') return;
        setSettings({ ...settings, [key]: !settings[key] });
      };

      const save = async () => {
        await mockSaveConsent(settings);
        args.onSave?.(settings);
        args.onClose?.();
      };

      return (
        <Transition show={args.open} as={Fragment}>
          <Dialog
            onClose={args.onClose || (() => {})}
            className="fixed inset-0 z-50"
            aria-label="Cookie preferences"
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-900 dark:text-gray-100">
                  <Dialog.Title className="text-lg font-semibold">
                    Cookie Preferences - Manage Your Privacy Settings and
                    Control How Your Data is Used
                  </Dialog.Title>

                  <div className="mt-4 space-y-2">
                    <label className="flex items-center justify-between">
                      <span>
                        Essential Cookies (Required for Basic Functionality)
                      </span>
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="h-4 w-4"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>
                        Analytics Cookies (Help Us Understand How You Use Our
                        Website and Improve Your Experience)
                      </span>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={settings.analytics}
                        onChange={() => toggle('analytics')}
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>
                        Marketing Cookies (Allow Us to Provide Personalized
                        Content and Advertisements)
                      </span>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={settings.marketing}
                        onChange={() => toggle('marketing')}
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={args.onClose}
                      className="rounded border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      );
    };

    return <LongTextCookieModal />;
  },
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => {
      // Instead of overriding React.createElement, we'll use a custom component
      // that wraps the CookieModal with long text content
      return (
        <div className="cookie-modal-long-text">
          <style>
            {`
              .cookie-modal-long-text .dialog-title {
                font-size: 1.125rem;
                line-height: 1.75rem;
                font-weight: 600;
              }
              
              .cookie-modal-long-text label span:first-child {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            `}
          </style>
          <Story />
        </div>
      );
    },
  ],
};

// Interactive story with keyboard navigation testing
export const KeyboardNavigation: Story = {
  render: (args) => {
    return (
      <div>
        <p className="mb-4 text-sm">
          Test keyboard navigation: Press Tab to navigate through focusable
          elements, Enter to activate buttons, and Escape to close the modal.
        </p>
        <CookieModal {...args} />
      </div>
    );
  },
  args: {
    ...Default.args,
  },
  play: async () => {
    // This would contain the actual keyboard navigation test
    // but we'll leave it as a manual test for now
  },
};

// A11y-friendly example
export const Accessibility: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    a11y: {
      // Enable all accessibility checks
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'aria-allowed-attr',
            enabled: true,
          },
        ],
      },
    },
  },
};
