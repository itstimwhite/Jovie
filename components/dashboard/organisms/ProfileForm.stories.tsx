import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm } from './ProfileForm';
import { Artist } from '@/types/db';
import { vi } from 'vitest';
import { ThemeProvider } from 'next-themes';

// Mock the Clerk hooks and Supabase
import * as ClerkNextjs from '@clerk/nextjs';
import * as SupabaseLib from '@/lib/supabase';
import * as EnvLib from '@/lib/env';

// Create a mock artist for our stories
const mockArtist: Artist = {
  id: 'artist-123',
  owner_user_id: 'user-123',
  handle: 'johndoe',
  spotify_id: 'spotify-123',
  name: 'John Doe',
  image_url: 'https://picsum.photos/200/200?random=1',
  tagline: 'Indie artist creating dreamy soundscapes and emotional journeys',
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
  },
  settings: {
    hide_branding: false,
  },
  spotify_url: 'https://open.spotify.com/artist/123',
  apple_music_url: 'https://music.apple.com/artist/123',
  youtube_url: 'https://youtube.com/channel/123',
  published: true,
  is_verified: false,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Mock artist with empty fields
const emptyArtist: Artist = {
  ...mockArtist,
  name: '',
  tagline: '',
  image_url: '',
};

// Mock artist with branding feature enabled
const brandingEnabledArtist: Artist = {
  ...mockArtist,
  settings: {
    hide_branding: true,
  },
};

const meta: Meta<typeof ProfileForm> = {
  title: 'Dashboard/Organisms/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#1e293b' },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    artist: {
      control: 'object',
      description: 'Artist data object',
    },
    onUpdate: {
      action: 'onUpdate',
      description: 'Callback when artist data is updated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with mock data
export const Default: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false), // No special features by default
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: mockArtist.id,
                    display_name: mockArtist.name,
                    bio: mockArtist.tagline,
                    avatar_url: mockArtist.image_url,
                    user_id: mockArtist.owner_user_id,
                    username: mockArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: mockArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false, // Disable image upload for stories
      });

      return <Story />;
    },
  ],
};

// Story with empty fields
export const EmptyFields: Story = {
  args: {
    artist: emptyArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: emptyArtist.id,
                    display_name: '',
                    bio: '',
                    avatar_url: null,
                    user_id: emptyArtist.owner_user_id,
                    username: emptyArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: emptyArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return <Story />;
    },
  ],
};

// Story with branding toggle enabled
export const WithBrandingToggle: Story = {
  args: {
    artist: brandingEnabledArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth with remove_branding feature
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockImplementation(({ feature }) => feature === 'remove_branding'),
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: brandingEnabledArtist.id,
                    display_name: brandingEnabledArtist.name,
                    bio: brandingEnabledArtist.tagline,
                    avatar_url: brandingEnabledArtist.image_url,
                    user_id: brandingEnabledArtist.owner_user_id,
                    username: brandingEnabledArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: brandingEnabledArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return <Story />;
    },
  ],
};

// Story with image upload enabled
export const WithImageUpload: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: mockArtist.id,
                    display_name: mockArtist.name,
                    bio: mockArtist.tagline,
                    avatar_url: mockArtist.image_url,
                    user_id: mockArtist.owner_user_id,
                    username: mockArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: mockArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags - enable image upload
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: true,
      });

      return <Story />;
    },
  ],
};

// Story with loading state
export const Loading: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client with delay
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockImplementation(() => 
                  new Promise(resolve => 
                    setTimeout(() => resolve({
                      data: {
                        id: mockArtist.id,
                        display_name: mockArtist.name,
                        bio: mockArtist.tagline,
                        avatar_url: mockArtist.image_url,
                        user_id: mockArtist.owner_user_id,
                        username: mockArtist.handle,
                        creator_type: 'artist',
                        is_public: true,
                        is_verified: false,
                        created_at: mockArtist.created_at,
                      },
                      error: null,
                    }), 2000)
                  )
                ),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return <Story />;
    },
  ],
};

// Story with error state
export const WithError: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client with error
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Failed to update profile' },
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return <Story />;
    },
  ],
};

// Story with dark theme
export const DarkTheme: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: mockArtist.id,
                    display_name: mockArtist.name,
                    bio: mockArtist.tagline,
                    avatar_url: mockArtist.image_url,
                    user_id: mockArtist.owner_user_id,
                    username: mockArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: mockArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="dark max-w-2xl mx-auto">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

// Story with mobile viewport
export const MobileView: Story = {
  args: {
    artist: mockArtist,
    onUpdate: (updatedArtist) => console.log('Artist updated:', updatedArtist),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => {
      // Mock Clerk auth
      vi.spyOn(ClerkNextjs, 'useAuth').mockImplementation(() => ({
        has: vi.fn().mockReturnValue(false),
      }));

      // Mock Supabase client
      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: mockArtist.id,
                    display_name: mockArtist.name,
                    bio: mockArtist.tagline,
                    avatar_url: mockArtist.image_url,
                    user_id: mockArtist.owner_user_id,
                    username: mockArtist.handle,
                    creator_type: 'artist',
                    is_public: true,
                    is_verified: false,
                    created_at: mockArtist.created_at,
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      vi.spyOn(SupabaseLib, 'useAuthenticatedSupabase').mockImplementation(() => ({
        getAuthenticatedClient: () => mockSupabaseClient,
      }));

      // Mock feature flags
      vi.spyOn(EnvLib, 'flags', 'get').mockReturnValue({
        feature_image_cdn_cloudinary: false,
      });

      return <Story />;
    },
  ],
};