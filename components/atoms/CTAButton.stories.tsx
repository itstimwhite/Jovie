import type { Meta, StoryObj } from '@storybook/react';
import { CTAButton } from './CTAButton';

const meta: Meta<typeof CTAButton> = {
  title: 'Atoms/CTAButton',
  component: CTAButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    external: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: '/dashboard',
    children: 'Get Started',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    href: '/dashboard',
    children: 'Learn More',
    variant: 'secondary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    href: '/dashboard',
    children: 'View Details',
    variant: 'outline',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    href: '/dashboard',
    children: 'Small Button',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    href: '/dashboard',
    children: 'Large Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    variant: 'primary',
    size: 'md',
    external: true,
  },
};

export const WithIcon: Story = {
  args: {
    href: '/dashboard',
    children: (
      <>
        Get Started →
      </>
    ),
    variant: 'primary',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CTAButton href="/dashboard" variant="primary" size="sm">
        Small Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="primary" size="md">
        Medium Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="primary" size="lg">
        Large Button
      </CTAButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CTAButton href="/dashboard" variant="primary" size="md">
        Primary Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="secondary" size="md">
        Secondary Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="outline" size="md">
        Outline Button
      </CTAButton>
    </div>
  ),
};