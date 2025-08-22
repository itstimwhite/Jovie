import type { Meta, StoryObj } from '@storybook/react';
import { 
  mockCreatorProfile, 
  mockSocialLinks, 
  mockReleases 
} from './fixtures';
import { mockSpotifyArtist } from './fixtures/spotify';

// This is a demo component to show how to use fixtures
const FixtureDemo = ({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: Record<string, unknown>;
}) => {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto max-h-96">
        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

const meta: Meta<typeof FixtureDemo> = {
  title: 'Examples/Fixture Demo',
  component: FixtureDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic creator profile example
export const CreatorProfile: Story = {
  args: {
    title: 'Creator Profile Fixture',
    description: 'Example of a creator profile fixture with default values',
    data: mockCreatorProfile(),
  },
};

// Customized creator profile
export const CustomizedProfile: Story = {
  args: {
    title: 'Customized Creator Profile',
    description: 'Creator profile with custom values via overrides parameter',
    data: mockCreatorProfile({
      display_name: 'Custom Artist Name',
      bio: 'This is a custom bio for demonstration purposes',
      is_verified: true,
      profile_views: 5000,
    }),
  },
};

// Social links collection
export const SocialLinks: Story = {
  args: {
    title: 'Social Links Collection',
    description: 'Collection of 3 social links with default values',
    data: mockSocialLinks(3),
  },
};

// Related data example
export const RelatedData: Story = {
  render: () => {
    // Create related data with consistent IDs
    const profileId = 'profile_demo123';
    const profile = mockCreatorProfile({ id: profileId });
    const links = mockSocialLinks(3, { creator_profile_id: profileId });
    const releases = mockReleases(2, { creator_id: profileId });
    
    // Combine the data
    const relatedData = {
      profile,
      links,
      releases,
    };
    
    return (
      <FixtureDemo
        title="Related Data Example"
        description="Profile, links, and releases with consistent IDs"
        data={relatedData}
      />
    );
  },
};

// Spotify artist example
export const SpotifyArtist: Story = {
  args: {
    title: 'Spotify Artist Fixture',
    description: 'Example of a Spotify artist fixture from specialized fixtures',
    data: mockSpotifyArtist(),
  },
};
