import type { Meta, StoryObj } from '@storybook/react';
import { BenefitsSection } from './BenefitsSection';

const meta: Meta<typeof BenefitsSection> = {
  title: 'Home/Organisms/BenefitsSection',
  component: BenefitsSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
  },
};
