import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Example component that demonstrates theme and viewport features
const ThemeAndViewportDemo = () => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Theme & Viewport Demo
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        This component demonstrates theme and viewport features in Storybook. It
        adapts to both light/dark modes and different viewport sizes.
      </p>

      {/* Responsive elements */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-blue-800 dark:text-blue-100 font-medium">
            This element has different styling in light vs dark mode
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200">Grid Item 1</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200">Grid Item 2</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200">Grid Item 3</p>
          </div>
        </div>

        <div className="block md:hidden p-4 bg-pink-100 dark:bg-pink-900 rounded-lg">
          <p className="text-pink-800 dark:text-pink-100">
            This element is only visible on mobile viewports
          </p>
        </div>

        <div className="hidden md:block lg:hidden p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <p className="text-purple-800 dark:text-purple-100">
            This element is only visible on tablet viewports
          </p>
        </div>

        <div className="hidden lg:block p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-green-800 dark:text-green-100">
            This element is only visible on desktop viewports
          </p>
        </div>
      </div>

      {/* A11y test elements */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Accessibility Examples
        </h3>

        {/* Good a11y */}
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <img
            src="https://via.placeholder.com/100"
            alt="Example of good accessibility with alt text"
            className="mb-2"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Example button with good accessibility"
          >
            Accessible Button
          </button>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof ThemeAndViewportDemo> = {
  title: 'Examples/Theme & Viewport Demo',
  component: ThemeAndViewportDemo,
};

export default meta;
type Story = StoryObj<typeof ThemeAndViewportDemo>;

// Default story
export const Default: Story = {};

// Dark mode story
export const DarkMode: Story = {
  parameters: {
    theme: 'dark',
  },
};

// Mobile viewport story
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Tablet viewport story
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Desktop viewport story
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Combined: Dark mode + Mobile
export const DarkMobile: Story = {
  parameters: {
    theme: 'dark',
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
