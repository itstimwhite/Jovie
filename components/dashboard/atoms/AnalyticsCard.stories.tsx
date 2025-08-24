import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsCard } from './AnalyticsCard';

const meta: Meta<typeof AnalyticsCard> = {
  title: 'Dashboard/Atoms/AnalyticsCard',
  component: AnalyticsCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple card component for displaying analytics data with a title, value, and optional metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the analytics card',
    },
    value: {
      control: 'text',
      description: 'The value to display (can be a number or string)',
    },
    metadata: {
      control: 'text',
      description: 'Optional metadata text to display below the value',
    },
    order: {
      control: 'text',
      description: 'Optional CSS class for ordering the card in a grid layout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with numeric value
export const Default: Story = {
  args: {
    title: 'Total Clicks',
    value: 1250,
    metadata: 'Last 30 days',
  },
};

// String value example
export const StringValue: Story = {
  args: {
    title: 'Status',
    value: 'Active',
    metadata: 'Current state',
  },
};

// Without metadata
export const WithoutMetadata: Story = {
  args: {
    title: 'Conversion Rate',
    value: '12.5%',
  },
};

// With custom order class
export const WithCustomOrder: Story = {
  args: {
    title: 'Revenue',
    value: '$1,234.56',
    metadata: 'Monthly',
    order: 'order-first',
  },
};

// Large number formatting
export const LargeNumber: Story = {
  args: {
    title: 'Total Users',
    value: 1234567,
    metadata: 'All time',
  },
};

// Empty or zero state
export const EmptyState: Story = {
  args: {
    title: 'New Subscribers',
    value: 0,
    metadata: 'Today',
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Light Theme</h3>
        <AnalyticsCard
          title="Total Clicks"
          value={1250}
          metadata="Last 30 days"
        />
      </div>
      <div className="p-6 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Dark Theme</h3>
        <div className="dark">
          <AnalyticsCard
            title="Total Clicks"
            value={1250}
            metadata="Last 30 days"
          />
        </div>
      </div>
    </div>
  ),
};

// Multiple cards in a grid
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
      <AnalyticsCard
        title="Total Clicks"
        value={1250}
        metadata="Last 30 days"
      />
      <AnalyticsCard
        title="Spotify Clicks"
        value={750}
        metadata="Music platform clicks"
      />
      <AnalyticsCard
        title="Social Clicks"
        value={350}
        metadata="Social media clicks"
      />
      <AnalyticsCard
        title="Recent Activity"
        value={120}
        metadata="Last 7 days"
      />
    </div>
  ),
};
