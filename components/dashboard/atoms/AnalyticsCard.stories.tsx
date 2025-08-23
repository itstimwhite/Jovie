import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsCard } from './AnalyticsCard';

const meta: Meta<typeof AnalyticsCard> = {
  title: 'Dashboard/Atoms/AnalyticsCard',
  component: AnalyticsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the analytics card',
    },
    value: {
      control: 'text',
      description: 'The primary value to display',
    },
    metadata: {
      control: 'text',
      description: 'Optional metadata text to display',
    },
    order: {
      control: 'text',
      description: 'Optional CSS class for ordering the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Plays',
    value: '12,345',
  },
};

export const WithPrimaryMetric: Story = {
  args: {
    title: 'Monthly Listeners',
    value: '5,678',
    metadata: 'Last 30 days',
  },
};

export const WithDelta: Story = {
  args: {
    title: 'Followers',
    value: '2,456',
    metadata: '+12% from last month',
  },
};

export const Loading: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <div className="animate-pulse">
        <AnalyticsCard title="Loading..." value="-" metadata="Please wait" />
      </div>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <div className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <AnalyticsCard
          title="Error Loading Data"
          value="--"
          metadata="Please try again later"
        />
      </div>
    </div>
  ),
};
