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
    useProgressiveForm: {
      control: { type: 'boolean' },
      description: 'Whether to use the progressive onboarding form',
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

export const StandardForm: Story = {
  args: {
    useProgressiveForm: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The standard onboarding form without progressive features.',
      },
    },
  },
};

export const ProgressiveForm: Story = {
  args: {
    useProgressiveForm: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The progressive onboarding form with advanced features.',
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
export const StandardFormDarkMode: Story = {
  args: {
    useProgressiveForm: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The standard onboarding form with dark mode enabled.',
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

export const ProgressiveFormDarkMode: Story = {
  args: {
    useProgressiveForm: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The progressive onboarding form with dark mode enabled.',
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
