import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsCards } from './AnalyticsCards';

const meta: Meta<typeof AnalyticsCards> = {
  title: 'Dashboard/Molecules/AnalyticsCards',
  component: AnalyticsCards,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Analytics cards display key metrics for the user dashboard.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Since we can't properly mock the hooks in Storybook without extra setup,
// we'll create a mock component for each state

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state while fetching analytics data.',
      },
    },
  },
  render: function Render() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {['Total Clicks', 'Spotify Clicks', 'Social Clicks', 'Recent Activity'].map((title) => (
          <div key={title} className="flex-1">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium truncate">{title}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error state when analytics data fails to load.',
      },
    },
  },
  render: function Render() {
    return (
      <div className="text-center text-red-600">
        <p>Failed to load analytics</p>
      </div>
    );
  },
};

export const WithData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Analytics cards with sample data.',
      },
    },
  },
  render: function Render() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">Total Clicks</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">1,234</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">Spotify Clicks</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">856</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Music platform clicks</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">Social Clicks</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">378</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Social media clicks</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">Recent Activity</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">142</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const EmptyData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Analytics cards with no data (all zeros).',
      },
    },
  },
  render: function Render() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {['Total Clicks', 'Spotify Clicks', 'Social Clicks', 'Recent Activity'].map((title, i) => (
          <div key={title} className="flex-1">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium truncate">{title}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">0</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {i === 0 && 'Last 30 days'}
                  {i === 1 && 'Music platform clicks'}
                  {i === 2 && 'Social media clicks'}
                  {i === 3 && 'Last 7 days'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

