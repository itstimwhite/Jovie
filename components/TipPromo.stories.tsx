import type { Meta, StoryObj } from '@storybook/react';
import TipPromo from './TipPromo';
import Link from 'next/link';

// Mock the environment variable for Storybook
process.env.NEXT_PUBLIC_FEATURE_TIPS = 'true';

const meta: Meta<typeof TipPromo> = {
  title: 'Components/TipPromo',
  component: TipPromo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InDarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { themeOverride: 'dark' },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

// This story demonstrates how the component would look with a longer title
export const LongTitle: Story = {
  render: () => {
    return (
      <section className="bg-zinc-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Support your favorite artists with{' '}
              <span className="text-indigo-400">instant tips</span> and show
              your appreciation
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed">
              Fans tap once, you get paid. No sign-ups, no fees,{' '}
              <br className="hidden sm:inline" />
              just pure support—directly in Venmo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tim/tip"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-lg font-medium text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See it live
            </Link>
          </div>
        </div>
      </section>
    );
  },
};

// This story demonstrates how the component would look with a longer description
export const LongDescription: Story = {
  render: () => {
    return (
      <section className="bg-zinc-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Tip, <span className="text-indigo-400">instantly.</span>
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed">
              Fans tap once, you get paid. No sign-ups, no fees, just pure
              support—directly in Venmo.
              <br className="hidden sm:inline" />
              Our tipping system is designed to be frictionless, allowing your
              fans to show their appreciation
              <br className="hidden sm:inline" />
              without any barriers. Get started today and boost your earnings
              with direct fan support.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tim/tip"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-lg font-medium text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See it live
            </Link>
          </div>
        </div>
      </section>
    );
  },
};
