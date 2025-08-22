import type { Meta, StoryObj } from '@storybook/react';
import { ThemeIcon } from './ThemeIcon';

const meta: Meta<typeof ThemeIcon> = {
  title: 'Atoms/Theme/ThemeIcon',
  component: ThemeIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
    },
    resolvedTheme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
    solid: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeIcon>;

export const Light: Story = {
  args: {
    theme: 'light',
    resolvedTheme: 'light',
    solid: false,
    size: 'md',
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
    resolvedTheme: 'dark',
    solid: false,
    size: 'md',
  },
};

export const System: Story = {
  args: {
    theme: 'system',
    resolvedTheme: 'light',
    solid: false,
    size: 'md',
  },
};

export const LightSolid: Story = {
  args: {
    theme: 'light',
    resolvedTheme: 'light',
    solid: true,
    size: 'md',
  },
};

export const DarkSolid: Story = {
  args: {
    theme: 'dark',
    resolvedTheme: 'dark',
    solid: true,
    size: 'md',
  },
};

export const SystemSolid: Story = {
  args: {
    theme: 'system',
    resolvedTheme: 'dark',
    solid: true,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    theme: 'light',
    resolvedTheme: 'light',
    solid: false,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    theme: 'light',
    resolvedTheme: 'light',
    solid: false,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    theme: 'light',
    resolvedTheme: 'light',
    solid: false,
    size: 'lg',
  },
};
