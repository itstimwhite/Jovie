import type { Meta, StoryObj } from '@storybook/react';
import { QRCodeCard } from './QRCodeCard';

const meta: Meta<typeof QRCodeCard> = {
  title: 'Molecules/QRCodeCard',
  component: QRCodeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    qrSize: {
      control: { type: 'number', min: 100, max: 300, step: 10 },
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    data: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: 'https://jovie.fm/taylorswift',
  },
};

export const WithCustomTitle: Story = {
  args: {
    data: 'https://jovie.fm/edsheeran',
    title: 'View Profile',
    description: 'Scan with your phone to view this artist profile',
  },
};

export const TipCard: Story = {
  args: {
    data: 'https://jovie.fm/billieeilish?mode=tip',
    title: 'Tip Artist',
    description: 'Scan to tip via Apple Pay',
    qrSize: 150,
  },
};

export const MobileProfile: Story = {
  args: {
    data: 'https://jovie.fm/theweeknd?utm_source=qr&utm_medium=mobile',
    title: 'View on Mobile',
    description: 'Best experience on your phone',
    qrSize: 120,
  },
};

export const LargeCard: Story = {
  args: {
    data: 'https://jovie.fm/drake',
    title: 'Artist Profile',
    description: 'Scan to view music, links, and more',
    qrSize: 200,
  },
};

export const NoDescription: Story = {
  args: {
    data: 'https://jovie.fm/arianagrande',
    title: 'Scan QR Code',
  },
};

export const NoTitle: Story = {
  args: {
    data: 'https://jovie.fm/postmalone',
    description: 'Scan with your camera app',
  },
};

export const MinimalCard: Story = {
  args: {
    data: 'https://jovie.fm/dualipa',
    qrSize: 100,
  },
};

export const InContainer: Story = {
  render: () => (
    <div className="p-6 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-xl border border-gray-200/30 dark:border-white/10">
      <QRCodeCard
        data="https://jovie.fm/taylorswift"
        title="View Artist Profile"
        description="Scan to view on mobile for the best experience"
        qrSize={160}
      />
    </div>
  ),
};

export const DesktopOverlay: Story = {
  render: () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center rounded-xl p-4 ring-1 ring-black/10 dark:ring-white/10 shadow-xl bg-white/85 dark:bg-gray-900/80 backdrop-blur-md">
      <QRCodeCard
        data="https://jovie.fm/oliviarodrigo"
        title="View on Mobile"
        qrSize={120}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const InDarkMode: Story = {
  args: {
    data: 'https://jovie.fm/kendricklamar',
    title: 'Scan QR Code',
    description: 'View artist profile on mobile',
    qrSize: 150,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { themeOverride: 'dark' },
  },
};

export const VeryLongURL: Story = {
  args: {
    data: 'https://jovie.fm/artist/very-long-artist-name-with-many-parameters?utm_source=qrcode&utm_medium=storybook&utm_campaign=testing&mode=tip&amount=10&currency=usd&referrer=storybook',
    title: 'Tip with Parameters',
    description: 'QR code with a very long URL containing many parameters',
    qrSize: 180,
  },
};

export const WithVeryLongTitle: Story = {
  args: {
    data: 'https://jovie.fm/artist/example',
    title:
      'This is a very long title that might wrap to multiple lines on smaller screens',
    description: 'Testing how the component handles long titles',
    qrSize: 150,
  },
};

export const WithVeryLongDescription: Story = {
  args: {
    data: 'https://jovie.fm/artist/example',
    title: 'QR Code',
    description:
      'This is a very long description that tests how the component handles text wrapping for longer content. It should wrap nicely and maintain readability while fitting within the component boundaries.',
    qrSize: 150,
  },
};

export const Mobile: Story = {
  args: {
    data: 'https://jovie.fm/artist/mobile-example',
    title: 'Mobile View',
    description: 'Optimized for mobile screens',
    qrSize: 120,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const WithCustomClassName: Story = {
  args: {
    data: 'https://jovie.fm/artist/custom-class',
    title: 'Custom Styling',
    description: 'Using custom className for styling',
    qrSize: 150,
    className: 'bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-800',
  },
};
