import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState, useRef } from 'react';
import { PendingClaimHandler } from './PendingClaimHandler';

// Create a demo component that demonstrates the behavior without global mocking
const PendingClaimHandlerDemo = ({
  hasPendingClaim = false,
  hasSelectedArtist = false,
  showControls = true,
}) => {
  const [redirected, setRedirected] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState({
    pendingClaim: hasPendingClaim,
    selectedArtist: hasSelectedArtist,
  });
  
  // Use ref to track if we've already set up the demo
  const setupRef = useRef(false);

  // Create a wrapper that demonstrates what the component would do
  const DemoWrapper = () => {
    useEffect(() => {
      // Simulate the component's behavior
      if (sessionState.pendingClaim && !sessionState.selectedArtist) {
        setRedirected(true);
        setRedirectPath('/artist-selection');
      } else {
        setRedirected(false);
        setRedirectPath(null);
      }
    }, [sessionState]);

    return (
      <div className="hidden">
        {/* The actual component would be here, but it renders nothing visible */}
        <PendingClaimHandler />
      </div>
    );
  };

  // Initialize session state on mount
  useEffect(() => {
    if (!setupRef.current) {
      setSessionState({
        pendingClaim: hasPendingClaim,
        selectedArtist: hasSelectedArtist,
      });
      setupRef.current = true;
    }
  }, [hasPendingClaim, hasSelectedArtist]);

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        PendingClaimHandler Demo
      </h2>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Current State:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Pending Claim:</span>
            <span
              className={
                sessionState.pendingClaim
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              {sessionState.pendingClaim ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Selected Artist:</span>
            <span
              className={
                sessionState.selectedArtist
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              {sessionState.selectedArtist ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Should Redirect:</span>
            <span
              className={
                redirected
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400'
              }
            >
              {redirected ? 'Yes' : 'No'}
            </span>
          </div>
          {redirectPath && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Redirect Path:</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">
                {redirectPath}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logic explanation */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Component Logic:</h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <div>• If <strong>pendingClaim</strong> exists but no <strong>selectedArtist</strong> → redirect to <code>/artist-selection</code></div>
          <div>• If both exist or neither exist → no redirect</div>
          <div>• This component renders nothing visible, it only has side effects</div>
        </div>
      </div>

      {showControls && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSessionState(prev => ({ ...prev, pendingClaim: true }));
                setRedirected(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                sessionState.pendingClaim 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {sessionState.pendingClaim ? '✓ Has Pending Claim' : 'Set Pending Claim'}
            </button>
            <button
              onClick={() => {
                setSessionState(prev => ({ ...prev, pendingClaim: false }));
                setRedirected(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                !sessionState.pendingClaim 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {!sessionState.pendingClaim ? '✓ No Pending Claim' : 'Remove Pending Claim'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSessionState(prev => ({ ...prev, selectedArtist: true }));
                setRedirected(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                sessionState.selectedArtist 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {sessionState.selectedArtist ? '✓ Has Selected Artist' : 'Set Selected Artist'}
            </button>
            <button
              onClick={() => {
                setSessionState(prev => ({ ...prev, selectedArtist: false }));
                setRedirected(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                !sessionState.selectedArtist 
                  ? 'bg-green-600 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {!sessionState.selectedArtist ? '✓ No Selected Artist' : 'Remove Selected Artist'}
            </button>
          </div>

          <button
            onClick={() => {
              setSessionState({ pendingClaim: false, selectedArtist: false });
              setRedirected(false);
              setRedirectPath(null);
            }}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      )}

      <div className="mt-6 p-4 border border-dashed rounded-lg">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Component Instance:</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          The PendingClaimHandler component is rendered below (invisible):
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border">
          <DemoWrapper />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Note: This component doesn't render anything visually, but it
          would trigger a redirect to /artist-selection if there's a pending
          claim without a selected artist.
        </p>
      </div>

      {/* Redirect simulation */}
      {redirected && (
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-orange-900 dark:text-orange-100">
                Redirect Triggered
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Component would redirect to: <code>{redirectPath}</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof PendingClaimHandlerDemo> = {
  title: 'Dashboard/PendingClaimHandler',
  component: PendingClaimHandlerDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A component that handles pending claims by checking sessionStorage and redirecting if needed. This component renders nothing visually but has important side effects for user flow.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hasPendingClaim: {
      control: 'boolean',
      description: 'Whether there is a pending claim in sessionStorage',
    },
    hasSelectedArtist: {
      control: 'boolean',
      description: 'Whether there is a selected artist in sessionStorage',
    },
    showControls: {
      control: 'boolean',
      description: 'Whether to show the interactive demo controls',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default state (no pending claim, no selected artist)
export const Default: Story = {
  args: {
    hasPendingClaim: false,
    hasSelectedArtist: false,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state with no pending claim and no selected artist. No redirect should occur.',
      },
    },
  },
};

// With pending claim, should redirect
export const WithPendingClaim: Story = {
  args: {
    hasPendingClaim: true,
    hasSelectedArtist: false,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When there is a pending claim but no selected artist, the component should redirect to the artist selection page.',
      },
    },
  },
};

// With pending claim and selected artist, no redirect
export const WithPendingClaimAndSelectedArtist: Story = {
  args: {
    hasPendingClaim: true,
    hasSelectedArtist: true,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When there is both a pending claim and a selected artist, the component should not redirect.',
      },
    },
  },
};

// Interactive demo without preset state
export const InteractiveDemo: Story = {
  args: {
    hasPendingClaim: false,
    hasSelectedArtist: false,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An interactive demo where you can toggle the sessionStorage state and observe the component behavior in real-time.',
      },
    },
  },
};

// Static demo without controls (for documentation)
export const StaticDemo: Story = {
  args: {
    hasPendingClaim: true,
    hasSelectedArtist: false,
    showControls: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A static demo showing the redirect state without interactive controls, useful for documentation.',
      },
    },
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-900 rounded-lg">
      <div className="dark">
        <PendingClaimHandlerDemo {...args} />
      </div>
    </div>
  ),
  args: {
    hasPendingClaim: true,
    hasSelectedArtist: false,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo in dark mode showing all the visual states and controls.',
      },
    },
  },
};