import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

// Example component that uses Next.js primitives
const NextJsExample = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <h2 className="text-xl font-bold">Next.js Primitives Example</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Current Router State:</h3>
        <div className="bg-gray-100 p-2 rounded">
          <p><strong>Pathname:</strong> {pathname}</p>
          <p><strong>Router Path:</strong> {router.pathname}</p>
          <p><strong>AsPath:</strong> {router.asPath}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Navigation:</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className="px-3 py-1 bg-blue-500 text-white rounded">
            Dashboard Link
          </Link>
          <Link href="/profile" className="px-3 py-1 bg-green-500 text-white rounded">
            Profile Link
          </Link>
          <button 
            onClick={() => router.push('/settings')}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            Settings (Router Push)
          </button>
          <button 
            onClick={() => router.replace('/home')}
            className="px-3 py-1 bg-orange-500 text-white rounded"
          >
            Home (Router Replace)
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Click the links or buttons above and check the console to see the navigation events.</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof NextJsExample> = {
  title: 'Examples/Next.js Stubs',
  component: NextJsExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// Story with custom router values
export const CustomPath: Story = {
  parameters: {
    globals: {
      pathname: '/dashboard',
      asPath: '/dashboard?tab=settings',
    },
  },
};
