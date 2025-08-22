import type { Meta, StoryObj } from '@storybook/react';
import { PendingClaimRunner } from './PendingClaimRunner';
import { useEffect } from 'react';

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
function PendingClaimRunnerWrapper({ 
  hasPendingClaim = false,
  children 
}: { 
  hasPendingClaim?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Set up the mock session storage
    if (hasPendingClaim) {
      mockSessionStorage.setItem('pendingClaim', JSON.stringify({ id: '123', status: 'pending' }));
    } else {
      mockSessionStorage.removeItem('pendingClaim');
    }
    
    // Replace the real sessionStorage with our mock for the story
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    
    // Clean up
    return () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true
      });
    };
  }, [hasPendingClaim]);
  
  return <>{children}</>;
}

const meta: Meta<typeof PendingClaimRunner> = {
  title: 'Bridge/PendingClaimRunner',
  component: PendingClaimRunner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that processes pending claims stored in session storage.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <PendingClaimRunnerWrapper hasPendingClaim={context.args.hasPendingClaim || false}>
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="mb-4 text-sm text-gray-500">
            {context.args.hasPendingClaim 
              ? 'Session storage has a pending claim that will be processed'
              : 'No pending claim in session storage'}
          </div>
          <Story />
        </div>
      </PendingClaimRunnerWrapper>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hasPendingClaim: false
  }
};

export const WithPendingClaim: Story = {
  args: {
    hasPendingClaim: true
  }
};

// Mock implementation to show the component's behavior
export const ProcessingState: Story = {
  render: () => {
    // Override console.log to show in the UI
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalConsoleLog(...args);
    };
    
    useEffect(() => {
      // Set up mock data
      mockSessionStorage.setItem('pendingClaim', JSON.stringify({ id: '123', status: 'pending' }));
      
      // Clean up
      return () => {
        console.log = originalConsoleLog;
      };
    }, []);
    
    return (
      <div>
        <PendingClaimRunner />
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <div className="font-semibold mb-2">Console Output:</div>
          {logs.length > 0 ? (
            logs.map((log, i) => <div key={i}>{log}</div>)
          ) : (
            <div className="text-gray-500">Waiting for logs...</div>
          )}
        </div>
      </div>
    );
  }
};

// Simulate different states in the claim process
export const SuccessState: Story = {
  render: () => {
    useEffect(() => {
      // Set up mock data
      mockSessionStorage.setItem('pendingClaim', JSON.stringify({ 
        id: '123', 
        status: 'success',
        artistId: 'artist-123'
      }));
    }, []);
    
    return (
      <div>
        <PendingClaimRunner />
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-green-700 font-medium">Success State</div>
          <div className="text-sm text-green-600">
            Claim processed successfully and removed from session storage
          </div>
        </div>
      </div>
    );
  }
};

export const ErrorState: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      // Mock console.error to capture the error message
      const originalConsoleError = console.error;
      console.error = (...args) => {
        setError(args.join(' '));
        originalConsoleError(...args);
      };
      
      // Set up mock data with an error condition
      mockSessionStorage.setItem('pendingClaim', JSON.stringify({ 
        id: '123', 
        status: 'error',
        error: 'Failed to process claim'
      }));
      
      // Clean up
      return () => {
        console.error = originalConsoleError;
      };
    }, []);
    
    return (
      <div>
        <PendingClaimRunner />
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="text-red-700 font-medium">Error State</div>
          <div className="text-sm text-red-600">
            {error || 'Error processing pending claims'}
          </div>
        </div>
      </div>
    );
  }
};

// Fix missing import
import { useState } from 'react';

