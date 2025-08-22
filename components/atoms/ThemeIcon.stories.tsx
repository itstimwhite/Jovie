import type { Meta, StoryObj } from '@storybook/react';
import { ThemeIcon } from './ThemeIcon';

const meta: Meta<typeof ThemeIcon> = {
  title: 'Atoms/ThemeIcon',
  component: ThemeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual theme icons with smooth animations and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'The theme this icon represents',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether this icon is currently active',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    reducedMotion: {
      control: 'boolean',
      description: 'Whether to use reduced motion',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: 'light',
    isActive: true,
    size: 'md',
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
    isActive: true,
    size: 'md',
  },
};

export const System: Story = {
  args: {
    theme: 'system',
    isActive: true,
    size: 'md',
  },
};

export const Inactive: Story = {
  args: {
    theme: 'light',
    isActive: false,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    theme: 'light',
    isActive: true,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    theme: 'light',
    isActive: true,
    size: 'lg',
  },
};

export const ReducedMotion: Story = {
  args: {
    theme: 'dark',
    isActive: true,
    size: 'md',
    reducedMotion: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon with reduced motion for accessibility preferences.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="text-center">
        <ThemeIcon theme="light" isActive size="md" />
        <p className="text-xs mt-2 text-gray-600">Light Active</p>
      </div>
      <div className="text-center">
        <ThemeIcon theme="dark" isActive size="md" />
        <p className="text-xs mt-2 text-gray-600">Dark Active</p>
      </div>
      <div className="text-center">
        <ThemeIcon theme="system" isActive size="md" />
        <p className="text-xs mt-2 text-gray-600">System Active</p>
      </div>
      <div className="text-center">
        <ThemeIcon theme="light" isActive={false} size="md" />
        <p className="text-xs mt-2 text-gray-600">Light Inactive</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All theme icon states side by side for comparison.',
      },
    },
  },
};