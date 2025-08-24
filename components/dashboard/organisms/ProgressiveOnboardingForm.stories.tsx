import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

// Mock data for consistent testing
const MOCK_SEARCH_RESULTS = [
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
];

const MOCK_SELECTED_ARTIST = {
  spotifyId: 'spotify_123',
  artistName: 'Test Artist',
  imageUrl: 'https://via.placeholder.com/150',
  popularity: 75,
  followers: 10000,
  spotifyUrl: 'https://open.spotify.com/artist/123',
  timestamp: Date.now(),
};

// Create a demo component that doesn't require complex mocking
const ProgressiveOnboardingFormDemo = ({
  initialStep = 0,
  mockError = false,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Step {currentStep + 1} of 4</div>
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
        <strong>Storybook Demo:</strong> This is a simplified version of the onboarding form 
        showing step {currentStep + 1}. The actual component uses complex hooks and dependencies.
        {mockError && (
          <div className="mt-2 text-red-600 dark:text-red-400">
            ⚠️ Error simulation enabled
          </div>
        )}
      </div>

      {/* Welcome step */}
      {currentStep === 0 && (
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome to Jovie! 🎵
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Let's create your artist profile in just a few simple steps.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              What you'll get:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Your own jovie.link/yourname URL</li>
              <li>• Professional artist profile page</li>
              <li>• Direct fan engagement tools</li>
              <li>• Analytics and insights</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 min-h-[48px]"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Artist selection step */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Find Your Artist Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Search for your artist profile on Spotify to connect your music.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search for your artist name..."
              className="w-full px-4 py-3 pl-12 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="space-y-3">
              {MOCK_SEARCH_RESULTS.map((artist) => (
                <div
                  key={artist.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => setCurrentStep(2)}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={artist.imageUrl} 
                      alt={artist.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {artist.followers.toLocaleString()} followers • {artist.popularity}% popularity
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(0)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Skip for Now
            </button>
          </div>
        </div>
      )}

      {/* Handle selection step */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Choose Your Handle
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This will be your unique jovie.link URL that fans use to find you.
            </p>
          </div>

          {/* Selected artist display */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={MOCK_SELECTED_ARTIST.imageUrl} 
                alt={MOCK_SELECTED_ARTIST.artistName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  {MOCK_SELECTED_ARTIST.artistName}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Connected Spotify Artist
                </p>
              </div>
            </div>
          </div>

          {/* Handle input */}
          <div className="space-y-2">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm">
                jovie.link/
              </span>
              <input
                type="text"
                defaultValue="testartist"
                className="flex-1 px-3 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Available
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Confirmation step */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Almost Done! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review your profile details and create your account.
            </p>
          </div>

          {/* Profile preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Your Profile Preview
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={MOCK_SELECTED_ARTIST.imageUrl}
                    alt={MOCK_SELECTED_ARTIST.artistName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {MOCK_SELECTED_ARTIST.artistName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    jovie.link/testartist
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Handle:</span>
                  <span className="font-mono text-gray-900 dark:text-white">@testartist</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Profile URL:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">jovie.link/testartist</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Spotify Artist:</span>
                  <span className="text-gray-900 dark:text-white">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                if (mockError) {
                  alert('Simulated error: Onboarding failed!');
                } else {
                  alert('Profile created successfully! Redirecting to dashboard...');
                }
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 min-h-[48px] font-medium"
            >
              {mockError ? 'Create Profile (Will Fail)' : 'Create My Profile'}
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Back to Edit Handle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof ProgressiveOnboardingFormDemo> = {
  title: 'Dashboard/Organisms/ProgressiveOnboardingForm',
  component: ProgressiveOnboardingFormDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multi-step form for onboarding new users, guiding them through artist selection, handle choice, and profile creation. This is a simplified demo version that shows the UI flow without complex dependencies.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialStep: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'The initial step to show in the form (0=Welcome, 1=Artist Search, 2=Handle, 3=Confirm)',
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
        <ProgressiveOnboardingFormDemo {...args} />
      </div>
    </div>
  ),
  args: {
    initialStep: 0,
    mockError: false,
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    initialStep: 0,
    mockError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive demo where you can navigate through all steps of the onboarding flow.',
      },
    },
  },
};