import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingForm } from './OnboardingForm';
import { rest } from 'msw';
import { userEvent, within } from '@storybook/testing-library';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: (param: string) => {
      if (param === 'handle') return null;
      return null;
    },
  }),
}));

// Mock the clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'user_123',
      fullName: 'Test User',
    },
  }),
}));

const meta: Meta<typeof OnboardingForm> = {
  title: 'Dashboard/Organisms/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        // Mock the handle check API
        rest.get('/api/handle/check', (req, res, ctx) => {
          const handle = req.url.searchParams.get('handle');
          
          // Simulate taken handle
          if (handle === 'taken') {
            return res(
              ctx.json({
                available: false,
              })
            );
          }
          
          // Simulate available handle
          return res(
            ctx.json({
              available: true,
            })
          );
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Pristine state
export const Pristine: Story = {};

// With values
export const WithValues: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/handle/check', (req, res, ctx) => {
          return res(ctx.json({ available: true }));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handleInput = canvas.getByPlaceholderText('your-handle');
    
    await userEvent.type(handleInput, 'artist-name', { delay: 100 });
    
    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },
};

// With validation error
export const WithValidationError: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/handle/check', (req, res, ctx) => {
          return res(ctx.json({ available: false }));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handleInput = canvas.getByPlaceholderText('your-handle');
    
    await userEvent.type(handleInput, 'taken', { delay: 100 });
    
    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },
};

// With format validation error
export const WithFormatError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handleInput = canvas.getByPlaceholderText('your-handle');
    
    await userEvent.type(handleInput, 'invalid@handle', { delay: 100 });
    
    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Loading/submitting state
export const Submitting: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/handle/check', (req, res, ctx) => {
          return res(ctx.json({ available: true }));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handleInput = canvas.getByPlaceholderText('your-handle');
    
    await userEvent.type(handleInput, 'valid-handle', { delay: 100 });
    
    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /create profile/i });
    await userEvent.click(submitButton);
  },
};

// With selected artist
export const WithSelectedArtist: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/handle/check', (req, res, ctx) => {
          return res(ctx.json({ available: true }));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    // Mock sessionStorage for selected artist
    const mockArtist = {
      spotifyId: 'spotify123',
      artistName: 'Test Artist',
      imageUrl: 'https://placekitten.com/200/200',
      timestamp: Date.now(),
    };
    
    // Mock sessionStorage.getItem
    const originalGetItem = window.sessionStorage.getItem;
    window.sessionStorage.getItem = (key) => {
      if (key === 'selectedArtist') {
        return JSON.stringify(mockArtist);
      }
      return originalGetItem.call(window.sessionStorage, key);
    };
    
    const canvas = within(canvasElement);
    const handleInput = canvas.getByPlaceholderText('your-handle');
    
    await userEvent.type(handleInput, 'test-artist', { delay: 100 });
    
    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Restore original sessionStorage.getItem
    window.sessionStorage.getItem = originalGetItem;
  },
};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};
