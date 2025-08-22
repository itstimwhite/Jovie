import type { Meta, StoryObj } from '@storybook/react';
import { PendingClaimHandler } from './PendingClaimHandler';
import { useEffect, useState } from 'react';
import * as NextNavigation from 'next/navigation';

// Create a mock router for our stories
const mockRouter = {
  push: (url: string) => {
    console.log(`Navigating to: ${url}`);
    return Promise.resolve(true);
  }
};

// Create a mock PendingClaimHandler that uses our mock router
// This is a workaround for Storybook since we can't use jest.mock
function MockPendingClaimHandler() {
  // Override the useRouter implementation just for this component
  const originalUseRouter = NextNavigation.useRouter;
  NextNavigation.useRouter = () => mockRouter as any;
  
  // Render the component with our mock
  const result = <PendingClaimHandler />;
  
  // Restore the original implementation
  NextNavigation.useRouter = originalUseRouter;
  
  return result;
}

// Mock sessionStorage for Storybook
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    setup: (initialState: Record<string, string>) => {
      store = { ...initialState };
    }
  };
})();

// Mock component wrapper to set up session storage state
function PendingClaimHandlerWrapper({ 
  pendingClaim = null,
  selectedArtist = null,
  children 
}: { 
  pendingClaim?: any;
  selectedArtist?: any;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Set up the mock session storage
    if (pendingClaim) {
      mockSessionStorage.setItem('pendingClaim', JSON.stringify(pendingClaim));
    } else {
      mockSessionStorage.removeItem('pendingClaim');
    }
    
    if (selectedArtist) {
      mockSessionStorage.setItem('selectedArtist', JSON.stringify(selectedArtist));
    } else {
      mockSessionStorage.removeItem('selectedArtist');
    }
    
    // Replace the real sessionStorage with our mock for the story
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    
    // We can't use jest.mock in Storybook, so we'll mock the router differently
    // This is just for demonstration purposes in the story
    
    // Clean up
    return () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true
      });
    };
  }, [pendingClaim, selectedArtist]);
  
  return <>{children}</>;
}

const meta: Meta<typeof PendingClaimHandler> = {
  title: 'Dashboard/PendingClaimHandler',
  component: MockPendingClaimHandler,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that checks for pending claims and redirects if needed.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <PendingClaimHandlerWrapper 
        pendingClaim={context.args.pendingClaim} 
        selectedArtist={context.args.selectedArtist}
      >
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="mb-4 text-sm text-gray-500">
            <div>
              <strong>Session Storage State:</strong>
            </div>
            <div>
              pendingClaim: {context.args.pendingClaim ? 'Present' : 'Not present'}
            </div>
            <div>
              selectedArtist: {context.args.selectedArtist ? 'Present' : 'Not present'}
            </div>
          </div>
          <Story />
        </div>
      </PendingClaimHandlerWrapper>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pendingClaim: null,
    selectedArtist: null
  }
};

export const WithPendingClaimNoArtist: Story = {
  args: {
    pendingClaim: { id: '123', status: 'pending' },
    selectedArtist: null
  },
  render: () => {
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    
    // Override router.push to capture the redirect
    useEffect(() => {
      const originalPush = mockRouter.push;
      mockRouter.push = (url: string) => {
        setRedirectUrl(url);
        return Promise.resolve(true);
      };
      
      return () => {
        mockRouter.push = originalPush;
      };
    }, []);
    
    return (
      <div>
        <MockPendingClaimHandler />
        {redirectUrl && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-blue-700 font-medium">Redirect Triggered</div>
            <div className="text-sm text-blue-600">
              Redirecting to: {redirectUrl}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export const WithPendingClaimAndArtist: Story = {
  args: {
    pendingClaim: { id: '123', status: 'pending' },
    selectedArtist: { id: 'artist-123', name: 'Test Artist' }
  }
};

export const NoPendingClaim: Story = {
  args: {
    pendingClaim: null,
    selectedArtist: { id: 'artist-123', name: 'Test Artist' }
  }
};

// Simulate the authentication state
export const AuthenticatedState: Story = {
  render: () => {
    useEffect(() => {
      // Set up mock data for an authenticated user with a pending claim
      mockSessionStorage.setItem('pendingClaim', JSON.stringify({ 
        id: '123', 
        status: 'pending',
        authenticated: true
      }));
      mockSessionStorage.setItem('selectedArtist', JSON.stringify({ 
        id: 'artist-123', 
        name: 'Test Artist' 
      }));
    }, []);
    
    return (
      <div>
        <MockPendingClaimHandler />
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-green-700 font-medium">Authenticated State</div>
          <div className="text-sm text-green-600">
            User is authenticated with a pending claim and selected artist
          </div>
        </div>
      </div>
    );
  }
};

// Note: In a real implementation, we would need to properly mock next/navigation
// but for Storybook demonstration purposes, this simplified approach works
