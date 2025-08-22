import type { Meta, StoryObj } from '@storybook/react';
import { ProductFlyout } from './ProductFlyout';
import { useRef } from 'react';

// Wrapper component to handle the triggerRef requirement
const ProductFlyoutWrapper = ({
  isOpen = true,
  onClose = () => {},
  className = '',
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative min-h-[600px] w-full max-w-[1200px] flex flex-col items-center">
      <button
        ref={triggerRef}
        id="product-trigger"
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Products Menu Trigger
      </button>
      <div className="w-full">
        <ProductFlyout
          isOpen={isOpen}
          onClose={onClose}
          triggerRef={triggerRef}
          className={className}
        />
      </div>
    </div>
  );
};

const meta: Meta<typeof ProductFlyoutWrapper> = {
  title: 'Organisms/ProductFlyout',
  component: ProductFlyoutWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flyout menu that displays product features in a grid layout with responsive design for mobile and desktop views.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the flyout is open or closed',
      defaultValue: true,
    },
    onClose: {
      action: 'closed',
      description: 'Function called when the flyout is closed',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the flyout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const WithCustomClassName: Story = {
  args: {
    isOpen: true,
    className: 'border-2 border-blue-500',
  },
};

export const Mobile: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Desktop: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const DarkMode: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LightMode: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};
