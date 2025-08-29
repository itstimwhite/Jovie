import type { Meta, StoryObj } from '@storybook/react';
import { TipQrCard } from './TipQrCard';

const meta: Meta<typeof TipQrCard> = {
  title: 'Tipping/TipQrCard',
  component: TipQrCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 100, max: 400, step: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tipUrl: 'https://jovie.fm/taylorswift?mode=tip',
    handle: 'taylorswift',
    title: 'Tip Artist',
    description: 'Scan to tip via Apple Pay or credit card',
    size: 200,
  },
};

export const WithoutDescription: Story = {
  args: {
    tipUrl: 'https://jovie.fm/drake?mode=tip',
    handle: 'drake',
    title: 'Support with a Tip',
    size: 200,
  },
};

export const LargeQRCode: Story = {
  args: {
    tipUrl: 'https://jovie.fm/billieeilish?mode=tip',
    handle: 'billieeilish',
    title: 'Send a Tip',
    description: 'Scan with your phone camera',
    size: 300,
  },
};

export const SmallQRCode: Story = {
  args: {
    tipUrl: 'https://jovie.fm/arianagrande?mode=tip',
    handle: 'arianagrande',
    title: 'Quick Tip',
    description: 'Support this artist',
    size: 150,
  },
};

export const DarkMode: Story = {
  args: {
    tipUrl: 'https://jovie.fm/theweeknd?mode=tip',
    handle: 'theweeknd',
    title: 'Tip Artist',
    description: 'Scan to support',
    size: 200,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
