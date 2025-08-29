import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EmptyError } from './EmptyError';

const meta: Meta<typeof EmptyError> = {
  title: 'UI/EmptyError',
  component: EmptyError,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRetry: { action: 'retry clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyError>;

// Default state
export const Default: Story = {
  args: {
    title: 'Something went wrong',
    description: 'We encountered an error while loading this content',
    retryLabel: 'Try again',
  },
};

// With retry button
export const WithRetry: Story = {
  args: {
    title: 'Failed to load data',
    description: 'There was a problem fetching the data. Please try again.',
    retryLabel: 'Retry',
    onRetry: () => console.log('Retry clicked'),
  },
};

// Loading state
export const Retrying: Story = {
  args: {
    title: 'Failed to load data',
    description: 'There was a problem fetching the data. Please try again.',
    retryLabel: 'Retry',
    onRetry: () => console.log('Retry clicked'),
    isRetrying: true,
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    title: 'Network error',
    description: 'Please check your internet connection and try again',
    retryLabel: 'Reconnect',
    onRetry: () => console.log('Reconnect clicked'),
    className:
      'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30',
  },
};

// Interactive example with working retry
export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
      setIsRetrying(true);
      // Simulate an API call
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    };

    return (
      <EmptyError
        title='Interactive example'
        description='Click the retry button to see the loading state'
        retryLabel='Simulate retry'
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    );
  },
};
