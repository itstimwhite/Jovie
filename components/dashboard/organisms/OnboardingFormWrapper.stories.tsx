import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingFormWrapper } from './OnboardingFormWrapper';

const meta: Meta<typeof OnboardingFormWrapper> = {
  title: 'Dashboard/Organisms/OnboardingFormWrapper',
  component: OnboardingFormWrapper,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' }, // Light background
        { name: 'dark', value: '#0D0E12' }, // Dark background
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the form is in a loading state',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: {
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The form in its ready state, displaying the full onboarding form.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The form in its loading state, displaying a loading spinner.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-progressbar-name',
            enabled: false,
          },
        ],
      },
    },
  },
};

// Dark mode variants
export const ReadyDarkMode: Story = {
  args: {
    isLoading: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The form in its ready state with dark mode enabled.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const LoadingDarkMode: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The form in its loading state with dark mode enabled.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-progressbar-name',
            enabled: false,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};
