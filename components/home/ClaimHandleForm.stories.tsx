import type { Meta, StoryObj } from '@storybook/react';
import { ClaimHandleForm } from './ClaimHandleForm';

// Mock the modules
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: false,
  }),
}));

jest.mock('@/constants/app', () => ({
  APP_URL: 'https://jovie.app',
}));

const meta: Meta<typeof ClaimHandleForm> = {
  title: 'Home/Organisms/ClaimHandleForm',
  component: ClaimHandleForm,
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

export const Empty: Story = {};

export const Focused: Story = {};

export const WithValidInput: Story = {};

export const WithInvalidInput: Story = {};

export const WithTakenHandle: Story = {};

export const WithServerError: Story = {};

export const WithLongHandle: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
  },
};

