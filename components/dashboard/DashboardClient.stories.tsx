import type { Meta, StoryObj } from '@storybook/react';
import { DashboardClient } from './DashboardClient';
import { CreatorProfile } from '@/types/db';

// Mock data for stories
const mockCreatorProfile: CreatorProfile = {
  id: 'profile_1',
  user_id: 'user_123',
  username: 'artistname',
  display_name: 'Artist Name',
  bio: 'This is a sample artist bio',
  avatar_url: 'https://via.placeholder.com/150',
  header_url: null,
  creator_type: 'musician',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  spotify_id: 'spotify_123',
  spotify_url: 'https://open.spotify.com/artist/123',
};

// Create multiple profiles for the multi-profile scenario
const createMultipleProfiles = (): CreatorProfile[] => {
  return [
    mockCreatorProfile,
    {
      ...mockCreatorProfile,
      id: 'profile_2',
      username: 'secondartist',
      display_name: 'Second Artist',
      avatar_url: 'https://via.placeholder.com/150?text=2',
      creator_type: 'band',
    },
    {
      ...mockCreatorProfile,
      id: 'profile_3',
      username: 'thirdartist',
      display_name: 'Third Artist',
      avatar_url: null,
      creator_type: 'dj',
    },
  ];
};

// Create a wrapper component to mock the router and other dependencies
const DashboardClientWrapper = (props) => {
  return <DashboardClient {...props} />;
};

const meta: Meta<typeof DashboardClientWrapper> = {
  title: 'Dashboard/DashboardClient',
  component: DashboardClientWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main client component for the dashboard that handles different states including onboarding, profile selection, and tab navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialData: {
      control: 'object',
      description:
        'Initial data for the dashboard including user, profiles, and onboarding state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Onboarding state
export const OnboardingState: Story = {
  args: {
    initialData: {
      user: { id: 'user_123' },
      creatorProfiles: [],
      selectedProfile: null,
      needsOnboarding: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The dashboard in onboarding state, shown when a user has not yet created a profile.',
      },
    },
  },
};

// Single profile state
export const SingleProfile: Story = {
  args: {
    initialData: {
      user: { id: 'user_123' },
      creatorProfiles: [mockCreatorProfile],
      selectedProfile: mockCreatorProfile,
      needsOnboarding: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'The dashboard with a single creator profile.',
      },
    },
  },
};

// Multiple profiles state
export const MultipleProfiles: Story = {
  args: {
    initialData: {
      user: { id: 'user_123' },
      creatorProfiles: createMultipleProfiles(),
      selectedProfile: createMultipleProfiles()[0],
      needsOnboarding: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The dashboard with multiple creator profiles, showing the profile selector.',
      },
    },
  },
};

// No selected profile (edge case)
export const NoSelectedProfile: Story = {
  args: {
    initialData: {
      user: { id: 'user_123' },
      creatorProfiles: createMultipleProfiles(),
      selectedProfile: null,
      needsOnboarding: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Edge case where there are profiles but none is selected. The component should handle this gracefully.',
      },
    },
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  render: (args) => (
    <div className="dark">
      <DashboardClientWrapper {...args} />
    </div>
  ),
  args: {
    initialData: {
      user: { id: 'user_123' },
      creatorProfiles: [mockCreatorProfile],
      selectedProfile: mockCreatorProfile,
      needsOnboarding: false,
    },
  },
};
