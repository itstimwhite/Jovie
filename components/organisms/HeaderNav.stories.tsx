import type { Meta, StoryObj } from '@storybook/react';
import { HeaderNav } from './HeaderNav';

// We need to mock the Clerk components for Storybook
// This is done by mocking the module in the meta parameters
const meta: Meta<typeof HeaderNav> = {
  title: 'Organisms/HeaderNav',
  component: HeaderNav,
  parameters: {
    layout: 'fullscreen',
    // Mock the Clerk hooks and components for Storybook
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true, // Default to authenticated
          }),
          SignInButton: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="mock-sign-in-button">{children}</div>
          ),
        },
      },
    ],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story with authenticated user
export const Authenticated: Story = {
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true,
          }),
        },
      },
    ],
  },
};

// Story with unauthenticated user
export const Unauthenticated: Story = {
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: false,
          }),
        },
      },
    ],
  },
};

// Mobile view story with authenticated user
export const MobileAuthenticated: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '375px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true,
          }),
        },
      },
    ],
  },
};

// Mobile view story with unauthenticated user
export const MobileUnauthenticated: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '375px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: false,
          }),
        },
      },
    ],
  },
};

// Dark mode story with authenticated user
export const DarkModeAuthenticated: Story = {
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ backgroundColor: '#0D0E12', minHeight: '200px' }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true,
          }),
        },
      },
    ],
  },
};

// Dark mode story with unauthenticated user
export const DarkModeUnauthenticated: Story = {
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ backgroundColor: '#0D0E12', minHeight: '200px' }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: false,
          }),
        },
      },
    ],
  },
};

// Story with custom active route
export const WithActiveRoute: Story = {
  decorators: [
    (Story) => (
      <div>
        {/* This is a mock implementation to simulate active route */}
        <style>{`
          a[href="/pricing"] {
            color: var(--color-primary, #6366f1) !important;
            font-weight: 600 !important;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true,
          }),
        },
      },
    ],
  },
};

// Story with custom nav links
export const WithCustomNavLinks: Story = {
  render: () => (
    <div>
      <div className="p-4 mb-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
        <p>
          <strong>Note:</strong> This story demonstrates how the HeaderNav would
          look with custom navigation links. In a real implementation, you would
          need to modify the HeaderNav component to accept navLinks as a prop.
        </p>
      </div>
      <HeaderNav />
    </div>
  ),
  parameters: {
    mockData: [
      {
        path: '@clerk/nextjs',
        data: {
          useUser: () => ({
            isSignedIn: true,
          }),
        },
      },
    ],
  },
};
