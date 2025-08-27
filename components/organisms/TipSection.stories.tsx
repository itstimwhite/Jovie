import type { Meta, StoryObj } from '@storybook/react';
import { TipSection } from './TipSection';

const meta: Meta<typeof TipSection> = {
  title: 'Organisms/TipSection',
  component: TipSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    amounts: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockStripePayment = async (amount: number) => {
  console.log(`Processing $${amount} via Stripe...`);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  console.log(`Payment successful: $${amount}`);
};

const mockVenmoPayment = (url: string) => {
  console.log(`Opening Venmo URL: ${url}`);
};

export const StripeOnly: Story = {
  args: {
    handle: 'taylorswift',
    artistName: 'Taylor Swift',
    onStripePayment: mockStripePayment,
  },
};

export const VenmoOnly: Story = {
  args: {
    handle: 'edsheeran',
    artistName: 'Ed Sheeran',
    venmoLink: 'https://venmo.com/u/edsheeran',
    venmoUsername: 'edsheeran',
    onVenmoPayment: mockVenmoPayment,
  },
};

export const BothPaymentMethods: Story = {
  args: {
    handle: 'billieeilish',
    artistName: 'Billie Eilish',
    onStripePayment: mockStripePayment,
    venmoLink: 'https://venmo.com/u/billieeilish',
    venmoUsername: 'billieeilish',
    onVenmoPayment: mockVenmoPayment,
  },
};

export const CustomAmounts: Story = {
  args: {
    handle: 'theweeknd',
    artistName: 'The Weeknd',
    amounts: [5, 10, 25],
    onStripePayment: mockStripePayment,
  },
};

export const LargeAmounts: Story = {
  args: {
    handle: 'drake',
    artistName: 'Drake',
    amounts: [10, 25, 50],
    onStripePayment: mockStripePayment,
  },
};

export const QRFallback: Story = {
  args: {
    handle: 'arianagrande',
    artistName: 'Ariana Grande',
    // No payment methods provided
  },
};

export const VenmoWithCustomAmounts: Story = {
  args: {
    handle: 'postmalone',
    artistName: 'Post Malone',
    amounts: [3, 7, 15],
    venmoLink: 'https://venmo.com/u/postmalone',
    venmoUsername: 'postmalone',
    onVenmoPayment: mockVenmoPayment,
  },
};

export const LoadingDemo: Story = {
  render: () => {
    const handlePayment = async (amount: number) => {
      console.log(`Processing $${amount}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`Payment complete: $${amount}`);
    };

    return (
      <TipSection
        handle='dualipa'
        artistName='Dua Lipa'
        amounts={[5, 10, 20]}
        onStripePayment={handlePayment}
      />
    );
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const handleStripePayment = async (amount: number) => {
      alert(`Processing $${amount} payment via Stripe...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Payment successful! Thank you for the $${amount} tip! 🎉`);
    };

    const handleVenmoPayment = (url: string) => {
      alert(`Would normally open: ${url}`);
    };

    return (
      <TipSection
        handle='oliviarodrigo'
        artistName='Olivia Rodrigo'
        amounts={[3, 5, 10]}
        onStripePayment={handleStripePayment}
        venmoLink='https://venmo.com/u/oliviarodrigo'
        venmoUsername='oliviarodrigo'
        onVenmoPayment={handleVenmoPayment}
      />
    );
  },
};

export const InDarkMode: Story = {
  args: {
    handle: 'weeknd',
    artistName: 'The Weeknd',
    onStripePayment: mockStripePayment,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
