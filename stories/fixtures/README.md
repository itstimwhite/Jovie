# Storybook Fixtures

This directory contains lightweight mock data for use in Storybook stories. These fixtures make it easy to create realistic stories without backend dependencies.

## Why Use Fixtures?

- **Consistency**: Ensure all stories use consistent, realistic data
- **Simplicity**: Avoid repetitive mock data creation in each story
- **Flexibility**: Easily customize data for specific story needs
- **Independence**: Stories work without backend connections

## Available Fixtures

The main fixtures module (`index.ts`) provides mock data for core types:

- `mockAppUser`: User account data
- `mockCreatorProfile`: Creator profile data
- `mockSocialLink`: Individual social link
- `mockSocialLinks`: Collection of social links
- `mockRelease`: Music/content release
- `mockReleases`: Collection of releases
- `mockClickEvent`: Analytics event
- `mockClickEvents`: Collection of analytics events
- `mockSubscription`: Subscription data
- `mockTip`: Tip/donation data
- `mockTips`: Collection of tips

Additional specialized fixtures:

- `spotify.ts`: Spotify-specific data (artists, albums)

## Basic Usage

Import the fixtures you need in your story file:

```tsx
import { mockCreatorProfile, mockSocialLinks } from '@/stories/fixtures';

export const Default: Story = {
  args: {
    profile: mockCreatorProfile(),
    links: mockSocialLinks(3), // Generate 3 social links
  },
};
```

## Customizing Fixtures

All fixture functions accept an optional `overrides` parameter to customize the generated data:

```tsx
import { mockCreatorProfile } from '@/stories/fixtures';

// Create a verified artist profile with custom name and bio
const customProfile = mockCreatorProfile({
  display_name: 'Custom Artist Name',
  bio: 'This is a custom bio for Storybook',
  is_verified: true,
});

export const VerifiedArtist: Story = {
  args: {
    profile: customProfile,
  },
};
```

## Combining Fixtures

You can combine and relate fixtures to create complex scenarios:

```tsx
import { mockCreatorProfile, mockSocialLinks, mockReleases } from '@/stories/fixtures';

// Create a profile with consistent ID
const profileId = 'profile_custom123';
const profile = mockCreatorProfile({ id: profileId });

// Create social links that reference this profile
const links = mockSocialLinks(3, { creator_profile_id: profileId });

// Create releases that reference this profile
const releases = mockReleases(2, { creator_id: profileId });

export const ArtistWithContent: Story = {
  args: {
    profile,
    links,
    releases,
  },
};
```

## Extending Fixtures

To add new fixtures:

1. Identify the type you need to mock
2. Add a new function to the appropriate file (or create a new file for specialized types)
3. Follow the pattern of existing fixtures
4. Export your new fixture function

Example:

```tsx
// In a new file: stories/fixtures/custom.ts
import { CustomType } from '@/types/custom';

export const mockCustomType = (overrides?: Partial<CustomType>): CustomType => ({
  id: 'custom_123',
  name: 'Custom Name',
  // ... other required properties
  ...overrides
});
```

## Best Practices

- Use fixtures for all Storybook stories that require complex data
- Keep fixture data realistic but not sensitive (no real emails, IDs, etc.)
- Customize only what's needed for your specific story
- Document any new fixtures you add
- Keep fixtures lightweight (avoid large data structures)

