import type { Meta, StoryObj } from '@storybook/react';
import BrandingBadge from './BrandingBadge';
import { useUser } from '@clerk/nextjs';

// Mock the Clerk useUser hook to avoid network calls
// @ts-ignore - Mocking for Storybook only
useUser.mockImplementation = (implementation: unknown) => {
  // @ts-ignore - Storybook mock
  useUser.implementation = implementation;
  // @ts-ignore - Storybook mock
  const original = useUser;
  // @ts-ignore - Storybook mock
  return function mockedUseUser() {
    // @ts-ignore - Storybook mock
    return useUser.implementation ? useUser.implementation() : original();
  };
};

const meta: Meta<typeof BrandingBadge> = {
  title: 'Components/BrandingBadge',
  component: BrandingBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Branding badge that shows "Made with Jovie" for free plan users. Hidden for Pro plan users.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VisualReference: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Visual reference of the branding badge.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Free Plan (Badge Visible):</h3>
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="text-xs opacity-60">Made with Jovie</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Pro Plan (Badge Hidden):</h3>
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="text-xs text-gray-300">
            [Badge hidden for Pro users]
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Implementation Notes:</h3>
        <p className="text-xs">
          The BrandingBadge component checks the user&apos;s plan in
          Clerk&apos;s publicMetadata. It renders &quot;Made with Jovie&quot;
          for free plan users and nothing for Pro plan users.
        </p>
        <p className="text-xs mt-2">
          <strong>Note:</strong> This is a visual reference only. The actual
          component requires Clerk authentication context to function properly.
        </p>
      </div>
    </div>
  ),
};

export const WithCustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Branding badge with custom styling applied.',
      },
    },
  },
  render: () => (
    <div className="p-4 bg-gray-100 rounded-md">
      <div className="text-xs opacity-60">Made with Jovie</div>
    </div>
  ),
};
