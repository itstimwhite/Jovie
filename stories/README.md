# Storybook Data Strategy

This document outlines our approach to providing data for Storybook components, making it easy to create realistic stories without backend dependencies.

## Overview

Our Storybook data strategy is based on lightweight fixtures/mocks that:

1. Provide realistic data for all common types from `@/types`
2. Allow easy customization for specific story needs
3. Can be shared and reused across multiple stories
4. Eliminate backend dependencies for component stories

## Directory Structure

```
stories/
├── fixtures/           # Reusable mock data
│   ├── index.ts        # Core type fixtures (CreatorProfile, SocialLink, etc.)
│   ├── spotify.ts      # Spotify-specific fixtures
│   └── README.md       # Documentation for using fixtures
├── FixtureDemo.stories.tsx  # Example story demonstrating fixture usage
└── README.md           # This documentation file
```

## Using Fixtures in Stories

### Basic Usage

Import the fixtures you need and use them in your story args:

```tsx
import { mockCreatorProfile, mockSocialLinks } from '@/stories/fixtures';

export const Default: Story = {
  args: {
    profile: mockCreatorProfile(),
    links: mockSocialLinks(3), // Generate 3 social links
  },
};
```

### Customizing Data

All fixture functions accept an optional `overrides` parameter:

```tsx
import { mockCreatorProfile } from '@/stories/fixtures';

export const VerifiedArtist: Story = {
  args: {
    profile: mockCreatorProfile({
      display_name: 'Custom Name',
      bio: 'Custom bio text',
      is_verified: true,
    }),
  },
};
```

### Creating Related Data

For components that need related data (e.g., a profile and its links):

```tsx
import { mockCreatorProfile, mockSocialLinks } from '@/stories/fixtures';

export const ProfileWithLinks: Story = {
  render: () => {
    // Create related data with consistent IDs
    const profileId = 'profile_custom123';
    const profile = mockCreatorProfile({ id: profileId });
    
    // Create social links that reference this profile
    const links = mockSocialLinks(3).map(link => ({
      ...link,
      creator_profile_id: profileId,
    }));
    
    return <YourComponent profile={profile} links={links} />;
  },
};
```

## Available Fixtures

See the [fixtures README](./fixtures/README.md) for a complete list of available fixtures and detailed usage instructions.

## Best Practices

1. **Use fixtures for all stories**: Avoid hardcoding mock data directly in stories
2. **Keep stories simple**: Focus on component presentation, not data creation
3. **Customize only what's needed**: Use default values when possible
4. **Document special cases**: Add comments for non-obvious data requirements
5. **Extend when needed**: Create new fixtures for specialized components

## Adding New Fixtures

When you need to create fixtures for new types:

1. Identify the type you need to mock
2. Add a new function to the appropriate file (or create a new file for specialized types)
3. Follow the pattern of existing fixtures
4. Export your new fixture function
5. Document the new fixture in the README

## Example Components

See these example stories for reference implementations:

- `stories/FixtureDemo.stories.tsx`: Demonstrates basic fixture usage
- `components/examples/ProfileCard.stories.tsx`: Shows practical component integration

## Benefits

This approach provides several benefits:

- **Consistency**: All stories use the same data structure
- **Maintainability**: Changes to data structure only need to be updated in one place
- **Readability**: Stories focus on component presentation, not data creation
- **Efficiency**: Reuse data across multiple stories
- **Isolation**: Stories work without backend connections

