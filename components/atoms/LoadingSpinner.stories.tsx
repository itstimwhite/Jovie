import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['light', 'dark', 'auto'],
    },
    showDebounce: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithDebounce: Story = {
  args: {
    showDebounce: true,
  },
};

export const JovieLogoSpinner: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <div className="text-center space-y-4">
      <LoadingSpinner {...args} />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Custom Jovie logo spinner
      </p>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <LoadingSpinner size="xs" />
        <p className="text-xs mt-1">XS</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="sm" />
        <p className="text-xs mt-1">SM</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="text-xs mt-1">MD</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs mt-1">LG</p>
      </div>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </button>
  ),
};

export const InListenButton: Story = {
  render: () => (
    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold">
      <LoadingSpinner size="sm" />
      <span>Opening...</span>
    </button>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg text-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Loading Artist Profile
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Please wait while we fetch the latest information...
      </p>
    </div>
  ),
};