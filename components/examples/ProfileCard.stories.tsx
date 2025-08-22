import type { Meta, StoryObj } from '@storybook/react';
import { mockCreatorProfile, mockSocialLinks } from '@/stories/fixtures';

// This is a simple example component to demonstrate fixture usage
const ProfileCard = ({
  profile,
  links,
}: {
  profile: Record<string, unknown>;
  links?: Array<Record<string, unknown>>;
}) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0">
          {profile.avatar_url ? (
            // Using img element for Storybook compatibility
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-48 w-full object-cover md:w-48"
              src={profile.avatar_url as string}
              alt={(profile.display_name as string) || (profile.username as string)}
            />
          ) : (
            <div className="h-48 w-full md:w-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-2xl font-bold">
                {((profile.display_name as string) || (profile.username as string) || 'User').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {(profile.display_name as string) || (profile.username as string)}
            </h2>
            {profile.is_verified && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{(profile.bio as string) || 'No bio available'}</p>
          
          {links && links.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Links:</h3>
              <ul className="mt-2 space-y-1">
                {links.map((link) => (
                  <li key={link.id as string} className="text-sm text-blue-500 hover:underline">
                    {(link.display_text as string) || (link.platform as string)}: {link.clicks} clicks
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof ProfileCard> = {
  title: 'Examples/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example using default fixtures
export const Default: Story = {
  args: {
    profile: mockCreatorProfile(),
    links: mockSocialLinks(3),
  },
};

// Example with customized profile
export const VerifiedArtist: Story = {
  args: {
    profile: mockCreatorProfile({
      display_name: 'Taylor Swift',
      bio: 'Award-winning artist and songwriter',
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&h=250&fit=crop',
    }),
    links: mockSocialLinks(5),
  },
};

// Example with consistent IDs between profile and links
export const RelatedData: Story = {
  render: () => {
    // Create related data with consistent IDs
    const profileId = 'profile_example123';
    const profile = mockCreatorProfile({ 
      id: profileId,
      display_name: 'Ed Sheeran',
      bio: 'Singer-songwriter from the UK',
    });
    
    // Create social links that reference this profile
    const links = mockSocialLinks(3).map((link, index) => ({
      ...link,
      creator_profile_id: profileId,
      // Customize the first link
      ...(index === 0 ? { platform: 'spotify', platform_type: 'spotify', clicks: 1250 } : {})
    }));
    
    return <ProfileCard profile={profile} links={links} />;
  },
};
