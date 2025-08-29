import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'plain'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary variant - High emphasis, used for main actions
 */
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

/**
 * Secondary variant - Medium emphasis, used for secondary actions
 */
export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

/**
 * Outline variant - Medium emphasis with a border and transparent background
 */
export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
};

/**
 * Ghost variant - Low emphasis, used for tertiary actions with minimal visual presence
 */
export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
};

/**
 * Plain variant - Minimal styling, typically used for text-only actions
 */
export const Plain: Story = {
  args: {
    children: 'Button',
    variant: 'plain',
  },
};

/**
 * Large size - For prominent actions
 */
export const Large: Story = {
  args: {
    children: 'Button',
    size: 'lg',
  },
};

/**
 * Medium size - Default size for most contexts
 */
export const Medium: Story = {
  args: {
    children: 'Button',
    size: 'md',
  },
};

/**
 * Small size - For compact UIs
 */
export const Small: Story = {
  args: {
    children: 'Button',
    size: 'sm',
  },
};

/**
 * Disabled state - Non-interactive state
 */
export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

/**
 * Loading state - Indicates an action in progress
 */
export const Loading: Story = {
  args: {
    children: 'Button',
    loading: true,
  },
};

/**
 * With Icon - Button with an icon alongside text
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 mr-2'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
            clipRule='evenodd'
          />
        </svg>
        Button with Icon
      </>
    ),
  },
};

/**
 * As Link - Button rendered as an anchor element
 */
export const AsLink: Story = {
  args: {
    children: 'Link Button',
    as: 'a',
    href: '#',
  },
};
