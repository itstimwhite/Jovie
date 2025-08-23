import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingForm } from './OnboardingForm';

// Setup the meta for the component
const meta: Meta<typeof OnboardingForm> = {
  title: 'Dashboard/Organisms/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
    // Mock fetch for handle validation
    mockData: [
      {
        url: '/api/handle/check?handle=available-handle',
        method: 'GET',
        status: 200,
        response: { available: true },
      },
      {
        url: '/api/handle/check?handle=taken-handle',
        method: 'GET',
        status: 200,
        response: { available: false },
      },
      {
        url: '/api/handle/check?handle=error-handle',
        method: 'GET',
        status: 500,
        response: { error: 'Server error' },
      },
    ],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - empty form
export const Default: Story = {};

// Story with a valid handle
export const ValidHandle: Story = {
  name: 'With Valid Handle',
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with a valid handle that passes validation.',
      },
    },
  },
};

// Story with an invalid handle
export const InvalidHandle: Story = {
  name: 'With Invalid Handle',
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with an invalid handle that fails validation.',
      },
    },
  },
};

// Story with a taken handle
export const TakenHandle: Story = {
  name: 'With Taken Handle',
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with a handle that is already taken.',
      },
    },
  },
};

// Story with a server error during validation
export const ServerError: Story = {
  name: 'With Server Error',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form when a server error occurs during handle validation.',
      },
    },
  },
};

// Story with a selected artist
export const WithSelectedArtist: Story = {
  name: 'With Selected Artist',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form with a pre-selected artist from session storage.',
      },
    },
  },
};

// Story with form submission in progress
export const SubmittingForm: Story = {
  name: 'Submitting Form',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form in the submitting state with loading indicators.',
      },
    },
  },
};

// Story with dark mode
export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
    docs: {
      description: {
        story: 'Shows the form in dark mode.',
      },
    },
  },
};

// Story with username suggestions
export const WithUsernameSuggestions: Story = {
  name: 'With Username Suggestions',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form with username suggestions for an invalid handle.',
      },
    },
  },
};
