import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { ProductFlyout } from './ProductFlyout';

// Mock Next.js Link component for Storybook
const MockedProductFlyout = (args: any) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(args.isOpen || false);

  return (
    <div className="relative h-96 w-full">
      {/* Mock trigger button to show how the flyout is positioned */}
      <button
        ref={triggerRef}
        id="product-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="mx-auto mt-8 flex rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        {isOpen ? 'Close Products' : 'Open Products'}
      </button>
      
      <ProductFlyout
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
      />
    </div>
  );
};

const meta: Meta<typeof ProductFlyout> = {
  title: 'Organisms/ProductFlyout',
  component: MockedProductFlyout,
  parameters: {
    layout: 'fullscreen',
    // Mock Next.js Link component for Storybook
    mockData: [
      {
        path: 'next/link',
        data: ({ children, href, ...props }: any) => (
          <a href={href} {...props} onClick={(e) => e.preventDefault()}>
            {children}
          </a>
        ),
      },
    ],
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the flyout is open or closed',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the flyout',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - flyout closed
export const Default: Story = {
  args: {
    isOpen: false,
  },
};

// Open state story - flyout open
export const Open: Story = {
  args: {
    isOpen: true,
  },
};

// Closed state story - flyout closed (explicit)
export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

// Desktop view with open flyout
export const DesktopOpen: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Mobile view with open flyout
export const MobileOpen: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet view with open flyout
export const TabletOpen: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '768px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Light theme variant (default)
export const LightTheme: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#ffffff', minHeight: '400px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

// Dark theme variant
export const DarkTheme: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ backgroundColor: '#0D0E12', minHeight: '400px', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
};

// Mobile dark theme
export const MobileDarkTheme: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ 
          backgroundColor: '#0D0E12', 
          minHeight: '400px', 
          padding: '1rem',
          width: '375px',
          margin: '0 auto'
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Interactive story with custom controls
export const Interactive: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div className="relative h-96 w-full p-8">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Interactive ProductFlyout Demo</h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Click the button to toggle the flyout. Test keyboard navigation with Tab and Arrow keys.
          </p>
          
          <button
            ref={triggerRef}
            id="product-trigger"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(!isOpen);
              }
            }}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            {isOpen ? 'Close Products Menu' : 'Open Products Menu'}
          </button>
        </div>
        
        <ProductFlyout
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          {...args}
        />
      </div>
    );
  },
};

// Story with custom styling
export const WithCustomStyling: Story = {
  args: {
    isOpen: true,
    className: 'border-2 border-blue-500 shadow-2xl',
  },
};

// Accessibility focused story
export const AccessibilityDemo: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div className="relative h-96 w-full p-8">
        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Accessibility Features
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200">
            <li>• Keyboard navigation with Arrow keys, Home, End</li>
            <li>• Escape key to close</li>
            <li>• Focus management and ARIA attributes</li>
            <li>• Screen reader compatible</li>
          </ul>
        </div>
        
        <div className="text-center">
          <button
            ref={triggerRef}
            id="product-trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            {isOpen ? 'Close Products Menu' : 'Open Products Menu'}
          </button>
        </div>
        
        <ProductFlyout
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          {...args}
        />
      </div>
    );
  },
};

// Reduced motion story
export const ReducedMotion: Story = {
  args: {
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        // Simulate prefers-reduced-motion: reduce
        animation: 'none',
        transition: 'none'
      }}>
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
};