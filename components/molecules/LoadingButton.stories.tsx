import type { Meta, StoryObj } from '@storybook/react';
import { LoadingButton } from './LoadingButton';

const meta: Meta<typeof LoadingButton> = {
  title: 'Molecules/LoadingButton',
  component: LoadingButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
    },
    spinnerSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'outline', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Submit',
  },
};

export const CustomLoadingText: Story = {
  args: {
    isLoading: true,
    loadingText: 'Processing...',
    children: 'Pay Now',
  },
};

export const ListenNowButton: Story = {
  args: {
    isLoading: false,
    children: 'Listen Now',
    size: 'lg',
    className: 'w-full max-w-sm',
  },
};

export const ListenNowLoading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Opening...',
    children: 'Listen Now',
    size: 'lg',
    className: 'w-full max-w-sm',
  },
};

export const TipButton: Story = {
  args: {
    isLoading: false,
    children: '$5 Tip',
    variant: 'default',
    size: 'lg',
    className: 'w-full',
  },
};

export const TipButtonLoading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Processing…',
    children: '$5 Tip',
    variant: 'default',
    size: 'lg',
    className: 'w-full',
  },
};

export const SmallSpinner: Story = {
  args: {
    isLoading: true,
    spinnerSize: 'xs',
    children: 'Save',
    size: 'sm',
  },
};

export const LargeSpinner: Story = {
  args: {
    isLoading: true,
    spinnerSize: 'lg',
    loadingText: 'Please wait...',
    children: 'Submit Order',
    size: 'lg',
  },
};

export const SecondaryVariant: Story = {
  args: {
    isLoading: true,
    variant: 'secondary',
    children: 'Save Draft',
  },
};

export const OutlineVariant: Story = {
  args: {
    isLoading: true,
    variant: 'outline',
    children: 'Cancel Order',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const LoadingDisabled: Story = {
  args: {
    isLoading: true,
    disabled: true,
    children: 'This should show loading',
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <LoadingButton
        isLoading={isLoading}
        onClick={handleClick}
        loadingText="Processing..."
        size="lg"
      >
        {isLoading ? 'Processing...' : 'Click to test'}
      </LoadingButton>
    );
  },
};