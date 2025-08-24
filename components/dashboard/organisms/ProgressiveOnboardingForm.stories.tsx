import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ProgressiveOnboardingForm } from './ProgressiveOnboardingForm';

// Create a wrapper component to mock the required hooks and dependencies
const ProgressiveOnboardingFormWrapper = ({
  initialStep = 0,
  mockError = false,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Mock the required hooks and dependencies
  const mockUseUser = () => ({
    user: {
      id: 'user_123',
      fullName: 'Test User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
    isLoaded: true,
    isSignedIn: true,
  });

  const mockUseSearchParams = () => ({
    get: (param: string) => {
      if (param === 'handle') return 'testartist';
      return null;
    },
  });

  const mockUseRouter = () => ({
    push: (path: string) => {
      console.log(`Redirecting to: ${path}`);
    },
  });

  const mockUseArtistSearch = () => ({
    searchResults: [
      {
        id: 'spotify_123',
        name: 'Test Artist',
        imageUrl: 'https://via.placeholder.com/150',
        popularity: 75,
        followers: 10000,
        spotifyUrl: 'https://open.spotify.com/artist/123',
      },
      {
        id: 'spotify_456',
        name: 'Another Artist',
        imageUrl: 'https://via.placeholder.com/150?text=2',
        popularity: 65,
        followers: 8000,
        spotifyUrl: 'https://open.spotify.com/artist/456',
      },
    ],
    isLoading: false,
    error: null,
    searchArtists: (query: string) => {
      console.log(`Searching for artist: ${query}`);
    },
    clearResults: () => {
      console.log('Clearing search results');
    },
  });

  // Mock the completeOnboarding action
  const mockCompleteOnboarding = async (data: Record<string, unknown>) => {
    console.log('Completing onboarding with data:', data);
    if (mockError) {
      throw new Error('Simulated onboarding error');
    }
    return { success: true };
  };

  // Mock the sessionStorage
  if (typeof window !== 'undefined') {
    // Save original methods to restore later
    const origMethods = {
      getItem: window.sessionStorage.getItem,
      setItem: window.sessionStorage.setItem,
      removeItem: window.sessionStorage.removeItem,
    };

    window.sessionStorage.getItem = (key) => {
      if (key === 'selectedArtist' && currentStep >= 2) {
        return JSON.stringify({
          spotifyId: 'spotify_123',
          artistName: 'Test Artist',
          imageUrl: 'https://via.placeholder.com/150',
          popularity: 75,
          followers: 10000,
          spotifyUrl: 'https://open.spotify.com/artist/123',
          timestamp: Date.now(),
        });
      }
      if (key === 'pendingClaim') {
        return JSON.stringify({ handle: 'testartist' });
      }
      return null;
    };

    window.sessionStorage.setItem = (key, value) => {
      console.log(`Setting sessionStorage: ${key} = ${value}`);
      if (key === 'selectedArtist') {
        setCurrentStep(2);
      }
    };

    window.sessionStorage.removeItem = (key) => {
      console.log(`Removing from sessionStorage: ${key}`);
    };

    // Restore original methods when component unmounts
    window.addEventListener('beforeunload', () => {
      window.sessionStorage.getItem = origMethods.getItem;
      window.sessionStorage.setItem = origMethods.setItem;
      window.sessionStorage.removeItem = origMethods.removeItem;
    });
  }

  // Override the hooks in the component
  // @ts-ignore - Mocking hooks for Storybook
  window.useUser = mockUseUser;
  // @ts-ignore - Mocking hooks for Storybook
  window.useSearchParams = mockUseSearchParams;
  // @ts-ignore - Mocking hooks for Storybook
  window.useRouter = mockUseRouter;
  // @ts-ignore - Mocking hooks for Storybook
  window.useArtistSearch = mockUseArtistSearch;
  // @ts-ignore - Mocking action for Storybook
  window.completeOnboarding = mockCompleteOnboarding;

  return <ProgressiveOnboardingForm />;
};

const meta: Meta<typeof ProgressiveOnboardingFormWrapper> = {
  title: 'Dashboard/Organisms/ProgressiveOnboardingForm',
  component: ProgressiveOnboardingFormWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multi-step form for onboarding new users, guiding them through artist selection, handle choice, and profile creation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialStep: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'The initial step to show in the form',
    },
    mockError: {
      control: 'boolean',
      description: 'Whether to simulate an error during form submission',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Welcome step
export const WelcomeStep: Story = {
  args: {
    initialStep: 0,
    mockError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The initial welcome step of the onboarding form.',
      },
    },
  },
};

// Artist search step
export const ArtistSearchStep: Story = {
  args: {
    initialStep: 1,
    mockError: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The artist search step where users can find their Spotify artist profile.',
      },
    },
  },
};

// Handle selection step
export const HandleSelectionStep: Story = {
  args: {
    initialStep: 2,
    mockError: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The handle selection step where users choose their unique URL handle.',
      },
    },
  },
};

// Confirmation step
export const ConfirmationStep: Story = {
  args: {
    initialStep: 3,
    mockError: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The final confirmation step where users review and confirm their profile details.',
      },
    },
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    initialStep: 3,
    mockError: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The form in an error state after submission fails.',
      },
    },
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-900 rounded-lg">
      <div className="dark">
        <ProgressiveOnboardingFormWrapper {...args} />
      </div>
    </div>
  ),
  args: {
    initialStep: 0,
    mockError: false,
  },
};
