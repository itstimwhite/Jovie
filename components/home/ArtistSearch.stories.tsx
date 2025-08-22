import type { Meta, StoryObj } from '@storybook/react';
import { ArtistSearch } from './ArtistSearch';

const meta: Meta<typeof ArtistSearch> = {
  title: 'Home/Organisms/ArtistSearch',
  component: ArtistSearch,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl w-full p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focused: Story = {};

export const WithInput: Story = {};

export const Searching: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
  },
};

