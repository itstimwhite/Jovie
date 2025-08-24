import type { Meta, StoryObj } from '@storybook/react';
import { ArtistSelectionForm } from './ArtistSelectionForm';
import { ThemeProvider } from 'next-themes';
// Simplified Storybook story for ArtistSelectionForm
// This component requires complex API mocking which is handled by Storybook's Next.js integration

const meta: Meta<typeof ArtistSelectionForm> = {
  title: 'Dashboard/Organisms/ArtistSelectionForm',
  component: ArtistSelectionForm,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding/artist-selection',
        query: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArtistSelectionForm>;

// Default story - shows the component in its initial state
export const Default: Story = {};

// Note: This component requires complex mocking of hooks and API calls
// For now, showing the component in its default state without interactive functionality
// Additional stories can be added once proper Storybook mocking is set up
