import type { Meta, StoryObj } from '@storybook/react';
import { Analytics } from './Analytics';

const meta: Meta<typeof Analytics> = {
  title: 'Components/Analytics',
  component: Analytics,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Analytics component that tracks page views. This component renders nothing visually.',
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
          'Default Analytics component that tracks page views. This component has no visual output.',
      },
    },
  },
  render: () => (
    <div>
      <Analytics />
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Analytics Debug Info:</h3>
        <p className="text-xs">
          <strong>Component Type:</strong> Invisible tracking component
        </p>
        <p className="text-xs">
          <strong>Visual Output:</strong> None
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Note: This component has no visual output, but it tracks page views in
          the background. It uses the usePathname hook from Next.js to track the
          current page path.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          In a real application, this component would call the page() function
          from the analytics library whenever the pathname changes.
        </p>
      </div>
    </div>
  ),
};

export const Implementation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Implementation details of the Analytics component.',
      },
    },
  },
  render: () => (
    <div>
      <Analytics />
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Implementation Details:</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {`'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { page } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return;

      // Track page views with our analytics
      page(pathname, {
        url: pathname,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [pathname]);

  return null;
}`}
        </pre>
        <p className="text-xs text-gray-500 mt-2">
          The component uses the usePathname hook to track the current page path
          and calls the page() function from the analytics library whenever the
          pathname changes. It also includes error handling to prevent analytics
          issues from breaking the app.
        </p>
      </div>
    </div>
  ),
};

export const WithLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Analytics component within a layout context.',
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
        Analytics component (invisible):
      </div>
      <Analytics />

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Page Content</h3>
        <p className="text-sm text-gray-700">
          This is where your actual page content would appear. The Analytics
          component is included in the layout but has no visual representation.
        </p>
      </div>

      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Usage Notes:</h3>
        <p className="text-xs">
          The Analytics component is typically included once in your app layout
          to track page views across all pages. It automatically tracks page
          changes using Next.js&apos;s usePathname hook.
        </p>
      </div>
    </div>
  ),
};
