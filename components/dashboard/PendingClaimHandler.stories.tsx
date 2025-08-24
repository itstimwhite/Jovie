import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { PendingClaimHandler } from './PendingClaimHandler';

// Create a wrapper component to demonstrate the behavior of PendingClaimHandler
const PendingClaimHandlerDemo = ({
  hasPendingClaim = false,
  hasSelectedArtist = false,
  showControls = true,
}) => {
  const [redirected, setRedirected] = useState(false);
  const [sessionState, setSessionState] = useState({
    pendingClaim: hasPendingClaim,
    selectedArtist: hasSelectedArtist,
  });

  // Set up the session storage mock
  useEffect(() => {
    // Mock sessionStorage
    const originalGetItem = window.sessionStorage.getItem;
    const originalSetItem = window.sessionStorage.setItem;
    const originalRemoveItem = window.sessionStorage.removeItem;

    window.sessionStorage.getItem = (key) => {
      if (key === 'pendingClaim' && sessionState.pendingClaim) {
        return JSON.stringify({ handle: 'example-handle' });
      }
      if (key === 'selectedArtist' && sessionState.selectedArtist) {
        return JSON.stringify({
          spotifyId: 'spotify_123',
          artistName: 'Example Artist',
          timestamp: Date.now(),
        });
      }
      return null;
    };

    window.sessionStorage.setItem = (key, value) => {
      console.log(`Setting sessionStorage: ${key} = ${value}`);
      if (key === 'pendingClaim') {
        setSessionState((prev) => ({ ...prev, pendingClaim: true }));
      }
      if (key === 'selectedArtist') {
        setSessionState((prev) => ({ ...prev, selectedArtist: true }));
      }
    };

    window.sessionStorage.removeItem = (key) => {
      console.log(`Removing from sessionStorage: ${key}`);
      if (key === 'pendingClaim') {
        setSessionState((prev) => ({ ...prev, pendingClaim: false }));
      }
      if (key === 'selectedArtist') {
        setSessionState((prev) => ({ ...prev, selectedArtist: false }));
      }
    };

    // Clean up
    return () => {
      window.sessionStorage.getItem = originalGetItem;
      window.sessionStorage.setItem = originalSetItem;
      window.sessionStorage.removeItem = originalRemoveItem;
    };
  }, [sessionState]);

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">PendingClaimHandler Demo</h2>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-medium mb-2">Current State:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Pending Claim:</span>
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
            <span>Selected Artist:</span>
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
            <span>Redirect Status:</span>
            <span
              className={
                redirected
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }
            >
              {redirected ? 'Redirected to /artist-selection' : 'No Redirect'}
            </span>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                window.sessionStorage.setItem(
                  'pendingClaim',
                  JSON.stringify({ handle: 'example-handle' })
                );
                setRedirected(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Pending Claim
            </button>
            <button
              onClick={() => {
                window.sessionStorage.removeItem('pendingClaim');
                setRedirected(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove Pending Claim
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                window.sessionStorage.setItem(
                  'selectedArtist',
                  JSON.stringify({
                    spotifyId: 'spotify_123',
                    artistName: 'Example Artist',
                    timestamp: Date.now(),
                  })
                );
                setRedirected(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Set Selected Artist
            </button>
            <button
              onClick={() => {
                window.sessionStorage.removeItem('selectedArtist');
                setRedirected(false);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Remove Selected Artist
            </button>
          </div>

          <button
            onClick={() => {
              // Reset the demo
              window.sessionStorage.removeItem('pendingClaim');
              window.sessionStorage.removeItem('selectedArtist');
              setRedirected(false);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
          >
            Reset Demo
          </button>
        </div>
      )}

      <div className="mt-6 p-4 border border-dashed rounded-lg">
        <h3 className="font-medium mb-2">Component Instance:</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          The PendingClaimHandler component is rendered below (invisible):
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border">
          {/* The actual component being tested */}
          <PendingClaimHandler />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Note: This component doesn&apos;t render anything visually, but it
          will trigger a redirect to /artist-selection if there&apos;s a pending
          claim without a selected artist.
        </p>
      </div>
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
          'A component that handles pending claims by checking sessionStorage and redirecting if needed. This component renders nothing visually but has side effects.',
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
      description: 'Whether to show the demo controls',
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
          'An interactive demo where you can manipulate the sessionStorage state and observe the component behavior.',
      },
    },
  },
};
