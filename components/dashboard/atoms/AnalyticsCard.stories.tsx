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
      description: 'Card title',
    },
    value: {
      control: 'text',
      description: 'Main value to display',
    },
    metadata: {
      control: 'text',
      description: 'Additional context or information',
    },
    order: {
      control: 'text',
      description: 'CSS order property for positioning',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Clicks',
    value: 1234,
    metadata: 'Last 30 days',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading...',
    value: '...',
  },
};

export const WithLargeNumber: Story = {
  args: {
    title: 'Total Impressions',
    value: 1000000,
    metadata: 'All time',
  },
};

export const WithCustomOrder: Story = {
  args: {
    title: 'Recent Activity',
    value: 42,
    metadata: 'Last 7 days',
    order: 'order-first',
  },
};

export const WithZeroValue: Story = {
  args: {
    title: 'New Subscribers',
    value: 0,
    metadata: 'This week',
  },
};
