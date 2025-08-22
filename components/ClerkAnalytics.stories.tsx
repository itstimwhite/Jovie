import type { Meta, StoryObj } from '@storybook/react';
import { ClerkAnalytics } from './ClerkAnalytics';

const meta: Meta<typeof ClerkAnalytics> = {
  title: 'Components/ClerkAnalytics',
  component: ClerkAnalytics,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Stub component to support Clerk analytics in the client. This component renders nothing visually.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default ClerkAnalytics component. This component has no visual output.',
      },
    },
  },
  render: () => (
    <div>
      <ClerkAnalytics />
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">ClerkAnalytics Debug Info:</h3>
        <p className="text-xs">
          <strong>Component Type:</strong> Stub component
        </p>
        <p className="text-xs">
          <strong>Visual Output:</strong> None
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Note: This is a stub component that can be extended to integrate Clerk
          analytics events as needed. It currently has no visual output or
          functionality.
        </p>
      </div>
    </div>
  ),
};

export const Implementation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Implementation details of the ClerkAnalytics component.',
      },
    },
  },
  render: () => (
    <div>
      <ClerkAnalytics />
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Implementation Details:</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {`'use client';

/**
 * Stub component to support Clerk analytics in the client.
 * Extend this to integrate Clerk analytics events as needed.
 */
export function ClerkAnalytics() {
  return null;
}`}
        </pre>
        <p className="text-xs text-gray-500 mt-2">
          This is a minimal stub component that can be extended to integrate
          Clerk analytics events. Currently, it simply returns null and has no
          functionality.
        </p>
      </div>
    </div>
  ),
};

export const WithLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ClerkAnalytics component within a layout context.',
      },
    },
  },
  render: () => (
    <div className="p-4 border border-gray-200 rounded-md">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold">App Layout</h2>
      </div>

      {/* Hidden component placement */}
      <div className="opacity-50 text-xs mb-2">
        ClerkAnalytics component (invisible):
      </div>
      <ClerkAnalytics />

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Page Content</h3>
        <p className="text-sm text-gray-700">
          This is where your actual page content would appear. The
          ClerkAnalytics component is included in the layout but has no visual
          representation.
        </p>
      </div>

      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Usage Notes:</h3>
        <p className="text-xs">
          The ClerkAnalytics component is typically included once in your app
          layout to track Clerk-related analytics events across all pages.
        </p>
      </div>
    </div>
  ),
};

export const ExtensionExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of how the ClerkAnalytics component could be extended.',
      },
    },
  },
  render: () => (
    <div>
      <ClerkAnalytics />
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">
          Potential Extension Example:
        </h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {`// Example of how this component could be extended
export function ClerkAnalytics() {
  const { session } = useSession();
  
  useEffect(() => {
    // Track sign-in events
    const handleSignIn = () => {
      analytics.track('user_signed_in');
    };
    
    // Track sign-out events
    const handleSignOut = () => {
      analytics.track('user_signed_out');
    };
    
    // Add event listeners
    Clerk.addListener('signIn', handleSignIn);
    Clerk.addListener('signOut', handleSignOut);
    
    return () => {
      // Remove event listeners
      Clerk.removeListener('signIn', handleSignIn);
      Clerk.removeListener('signOut', handleSignOut);
    };
  }, [session]);
  
  return null;
}`}
        </pre>
        <p className="text-xs text-gray-500 mt-2">
          Note: This is just an example of how the component could be extended.
          The actual implementation would depend on your specific requirements.
        </p>
      </div>
    </div>
  ),
};
