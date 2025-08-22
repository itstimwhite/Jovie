import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingForm } from './OnboardingForm';
import { ThemeProvider } from 'next-themes';
import { vi } from 'vitest';
import { action } from '@storybook/addon-actions';

// Mock the hooks and modules
import * as NextNavigation from 'next/navigation';
import * as ClerkNextjs from '@clerk/nextjs';

// Mock fetch API for handle checking
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock sessionStorage
const mockSessionStorage = () => {
  let store: Record<string, string> = {};

  // Save the original sessionStorage
  const originalSessionStorage = window.sessionStorage;

  // Replace with mock implementation
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
        action('sessionStorage.setItem')(key, value);
      },
      removeItem: (key: string) => {
        delete store[key];
        action('sessionStorage.removeItem')(key);
      },
      clear: () => {
        store = {};
        action('sessionStorage.clear')();
      },
    },
    writable: true,
  });

  // Return a function to reset the mock and restore original
  return {
    reset: () => {
      store = {};
    },
    restore: () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true,
      });
    },
    setStore: (newStore: Record<string, string>) => {
      store = { ...newStore };
    },
  };
};

// Mock server action
vi.mock('@/app/onboarding/actions', () => ({
  completeOnboarding: vi.fn().mockImplementation(async ({ username, displayName }) => {
    action('completeOnboarding')({ username, displayName });
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate success
    return { success: true };
  }),
}));

const meta: Meta<typeof OnboardingForm> = {
  title: 'Dashboard/Organisms/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'OnboardingForm handles user profile creation with real-time handle validation, selected artist integration, and optimistic progress tracking.',
      },
    },
  },
  argTypes: {
    // Controls for different states
    userEmail: {
      control: 'text',
      description: 'User email for the mock user',
      defaultValue: 'user@example.com',
    },
    initialHandle: {
      control: 'text',
      description: 'Pre-filled handle value',
      defaultValue: '',
    },
    selectedArtist: {
      control: 'object',
      description: 'Selected artist data',
      defaultValue: null,
    },
    handleValidationMode: {
      control: 'select',
      options: ['available', 'taken', 'checking', 'error', 'invalid-format'],
      description: 'Handle validation state',
      defaultValue: 'available',
    },
    onboardingStep: {
      control: 'select',
      options: ['validating', 'creating-user', 'checking-handle', 'creating-artist', 'complete'],
      description: 'Current onboarding step for simulation',
      defaultValue: 'validating',
    },
    networkDelay: {
      control: { type: 'range', min: 0, max: 3000, step: 100 },
      description: 'Network delay simulation (ms)',
      defaultValue: 500,
    },
    enableRetryScenario: {
      control: 'boolean',
      description: 'Simulate error that requires retry',
      defaultValue: false,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="max-w-md mx-auto p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingForm>;

// Helper to create mock user
const createMockUser = (email: string = 'user@example.com') => ({
  id: 'user_12345',
  emailAddresses: [{ emailAddress: email }],
  firstName: 'John',
  lastName: 'Doe',
  imageUrl: 'https://img.clerk.com/preview.png',
});

// Helper to setup mocks
const setupMocks = (args: any) => {
  const storage = mockSessionStorage();
  storage.reset();

  // Set up initial data based on args
  if (args.initialHandle) {
    storage.setStore({
      pendingClaim: JSON.stringify({ handle: args.initialHandle })
    });
  }

  if (args.selectedArtist) {
    storage.setStore({
      ...storage,
      selectedArtist: JSON.stringify(args.selectedArtist)
    });
  }

  // Mock Next.js router
  const pushMock = vi.fn().mockImplementation((url) => {
    action('router.push')(url);
  });
  const prefetchMock = vi.fn().mockImplementation((url) => {
    action('router.prefetch')(url);
  });

  vi.spyOn(NextNavigation, 'useRouter').mockImplementation(() => ({
    push: pushMock,
    prefetch: prefetchMock,
  }) as any);

  vi.spyOn(NextNavigation, 'useSearchParams').mockImplementation(() => {
    const params = new URLSearchParams();
    if (args.initialHandle) {
      params.set('handle', args.initialHandle);
    }
    return params as any;
  });

  // Mock Clerk user
  vi.spyOn(ClerkNextjs, 'useUser').mockImplementation(() => ({
    user: createMockUser(args.userEmail),
    isLoaded: true,
    isSignedIn: true,
  }));

  // Mock handle validation API
  mockFetch.mockImplementation(async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, args.networkDelay || 500));
    
    if (args.enableRetryScenario) {
      throw new Error('Network error');
    }

    if (url.includes('/api/handle/check')) {
      const urlObj = new URL(url, 'http://localhost');
      const handle = urlObj.searchParams.get('handle');
      
      action('API: handle validation')(handle);

      switch (args.handleValidationMode) {
        case 'taken':
          return Promise.resolve({
            ok: true,
            json: async () => ({ available: false })
          });
        case 'error':
          return Promise.resolve({
            ok: false,
            json: async () => ({ error: 'Server error' })
          });
        case 'available':
        default:
          return Promise.resolve({
            ok: true,
            json: async () => ({ available: true })
          });
      }
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({})
    });
  });

  return { storage };
};

// Default story
export const Default: Story = {
  args: {
    userEmail: 'user@example.com',
    initialHandle: '',
    selectedArtist: null,
    handleValidationMode: 'available',
    networkDelay: 500,
    enableRetryScenario: false,
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with prefilled handle
export const WithPrefilledHandle: Story = {
  args: {
    ...Default.args,
    initialHandle: 'johndoe',
    handleValidationMode: 'available',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with selected artist
export const WithSelectedArtist: Story = {
  args: {
    ...Default.args,
    initialHandle: 'theweeknd',
    selectedArtist: {
      spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ',
      artistName: 'The Weeknd',
      imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb94fbdb362091111a47db337d',
      timestamp: Date.now(),
    },
    handleValidationMode: 'available',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with handle validation checking
export const HandleChecking: Story = {
  args: {
    ...Default.args,
    initialHandle: 'checking',
    handleValidationMode: 'checking',
    networkDelay: 2000,
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with handle taken
export const HandleTaken: Story = {
  args: {
    ...Default.args,
    initialHandle: 'taken',
    handleValidationMode: 'taken',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with invalid handle format
export const InvalidHandleFormat: Story = {
  args: {
    ...Default.args,
    initialHandle: 'inv@lid!',
    handleValidationMode: 'invalid-format',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with validation error
export const ValidationError: Story = {
  args: {
    ...Default.args,
    initialHandle: 'errortest',
    handleValidationMode: 'error',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Story with retry scenario
export const RetryScenario: Story = {
  args: {
    ...Default.args,
    initialHandle: 'retrytest',
    enableRetryScenario: true,
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Dark theme variant
export const DarkTheme: Story = {
  args: {
    ...Default.args,
    initialHandle: 'darkmode',
    selectedArtist: {
      spotifyId: '06HL4z0CvFAxyc27GXpf02',
      artistName: 'Taylor Swift',
      imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      timestamp: Date.now(),
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="max-w-md mx-auto p-6 bg-gray-900 min-h-screen">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

// Mobile responsive variant
export const Mobile: Story = {
  args: {
    ...Default.args,
    initialHandle: 'mobile',
    selectedArtist: {
      spotifyId: '3TVXtAsR1Inumwj472S9r4',
      artistName: 'Drake',
      imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
      timestamp: Date.now(),
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return (
        <div className="w-full px-4 py-6">
          <Story />
        </div>
      );
    },
  ],
};

// Tablet responsive variant
export const Tablet: Story = {
  args: {
    ...Default.args,
    initialHandle: 'tablet',
    selectedArtist: {
      spotifyId: '0Y5tJX1MQlPlqiwlOH1tJY',
      artistName: 'Travis Scott',
      imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb59ba2594b5aa3e3e3cfcce8c',
      timestamp: Date.now(),
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return (
        <div className="w-full max-w-lg mx-auto px-6 py-8">
          <Story />
        </div>
      );
    },
  ],
};

// Onboarding in progress simulation
export const OnboardingInProgress: Story = {
  args: {
    ...Default.args,
    initialHandle: 'progress',
    handleValidationMode: 'available',
    onboardingStep: 'creating-user',
  },
  decorators: [
    (Story, { args }) => {
      const { storage } = setupMocks(args);
      
      // This story shows the progress state - no auto-trigger needed

      return <Story />;
    },
  ],
};

// Complete onboarding state
export const OnboardingComplete: Story = {
  args: {
    ...Default.args,
    initialHandle: 'completed',
    handleValidationMode: 'available',
    onboardingStep: 'complete',
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return <Story />;
    },
  ],
};

// Full flow demo (interactive)
export const FullFlowDemo: Story = {
  args: {
    ...Default.args,
    userEmail: 'demo@jovie.com',
    selectedArtist: {
      spotifyId: '6eUKZXaKkcviH0Ku9w2n3V',
      artistName: 'Ed Sheeran',
      imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba',
      timestamp: Date.now(),
    },
    networkDelay: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the complete onboarding flow with realistic timing and user feedback.',
      },
    },
  },
  decorators: [
    (Story, { args }) => {
      setupMocks(args);
      return (
        <div className="max-w-md mx-auto p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Complete Your Profile
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose your unique handle to get started
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};