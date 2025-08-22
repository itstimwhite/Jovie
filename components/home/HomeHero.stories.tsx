import type { Meta, StoryObj } from '@storybook/react';
import { HomeHero } from './HomeHero';

// Mock the feature flag hook
jest.mock('@/lib/analytics', () => ({
  useFeatureFlagWithLoading: (flag: string, defaultValue: boolean) => {
    // Return different values based on the story
    if (window.location.search.includes('loading=true')) {
      return { enabled: defaultValue, loading: true };
    } else if (window.location.search.includes('claim-handle=true')) {
      return { enabled: true, loading: false };
    } else {
      return { enabled: false, loading: false };
    }
  },
  FEATURE_FLAGS: {
    CLAIM_HANDLE: 'claim_handle',
  },
}));

const meta: Meta<typeof HomeHero> = {
  title: 'Home/Organisms/HomeHero',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSubtitle: Story = {
  args: {
    subtitle: 'Build your music career with our all-in-one platform',
  },
};

export const WithJSXSubtitle: Story = {
  args: {
    subtitle: (
      <>
        Create your <strong>professional</strong> artist page
      </>
    ),
  },
};

export const WithLongSubtitle: Story = {
  args: {
    subtitle: 'This is a very long subtitle that might wrap to multiple lines on smaller screens and could potentially cause layout issues if not handled properly in the component.',
  },
};

export const LoadingState: Story = {
  parameters: {
    // Add a URL parameter to trigger the loading state in our mocked hook
    url: '?loading=true',
  },
};

export const WithClaimHandleForm: Story = {
  parameters: {
    // Add a URL parameter to enable the claim handle form
    url: '?claim-handle=true',
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    darkMode: true,
  },
};

