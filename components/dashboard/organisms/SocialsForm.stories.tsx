import type { Meta, StoryObj } from '@storybook/react';
import { SocialsForm } from './SocialsForm';
import { Artist } from '@/types/db';
import * as React from 'react';

// Mock the useAuthenticatedSupabase hook
import * as supabaseModule from '@/lib/supabase';

// Mock artist data for stories
const mockArtist: Artist = {
  id: 'mock-artist-id',
  owner_user_id: 'mock-user-id',
  handle: 'artisthandle',
  spotify_id: 'mock-spotify-id',
  name: 'Mock Artist',
  image_url: 'https://example.com/avatar.jpg',
  tagline: 'Mock artist tagline',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Mock social links data
const mockSocialLinks = [
  {
    id: 'link-1',
    platform: 'instagram',
    url: 'https://instagram.com/artisthandle',
  },
  {
    id: 'link-2',
    platform: 'twitter',
    url: 'https://twitter.com/artisthandle',
  },
  {
    id: 'link-3',
    platform: 'youtube',
    url: 'https://youtube.com/@artisthandle',
  },
];

// Mock empty social links for default state
interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const mockEmptySocialLinks: SocialLink[] = [];

// Mock invalid social links for validation error state
const mockInvalidSocialLinks = [
  { id: 'link-1', platform: 'instagram', url: 'invalid-url' },
];

const meta: Meta<typeof SocialsForm> = {
  title: 'Dashboard/Organisms/SocialsForm',
  component: SocialsForm,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    a11y: {
      config: {
        rules: [
          {
            // We're mocking the Supabase client, so we can ignore this warning
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to setup mocks for each story
const withSupabaseMock = (
  Story: React.ComponentType,
  socialLinks: SocialLink[] = [],
  shouldError: boolean = false
) => {
  // Save the original implementation
  const originalUseAuthenticatedSupabase =
    supabaseModule.useAuthenticatedSupabase;

  // Mock the Supabase client and responses
  const mockSupabaseClient = {
    from: () => ({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: socialLinks,
            error: null,
          }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      insert: () =>
        Promise.resolve({
          error: shouldError ? { message: 'Validation error' } : null,
        }),
    }),
  };

  // Override the useAuthenticatedSupabase hook
  // @ts-ignore - we're intentionally mocking this
  supabaseModule.useAuthenticatedSupabase = () => ({
    getAuthenticatedClient: () => mockSupabaseClient,
    supabase: mockSupabaseClient,
  });

  // Render the story
  const result = <Story />;

  // Restore the original implementation after rendering
  // @ts-ignore - we're intentionally restoring this
  supabaseModule.useAuthenticatedSupabase = originalUseAuthenticatedSupabase;

  return result;
};

// Default story - empty state
export const Default: Story = {
  decorators: [(Story) => withSupabaseMock(Story, mockEmptySocialLinks)],
  args: {
    artist: mockArtist,
  },
};

// Prefilled story - with existing social links
export const Prefilled: Story = {
  decorators: [(Story) => withSupabaseMock(Story, mockSocialLinks)],
  args: {
    artist: mockArtist,
  },
};

// Validation error story
export const ValidationError: Story = {
  decorators: [
    (Story) => withSupabaseMock(Story, mockInvalidSocialLinks, true),
  ],
  args: {
    artist: mockArtist,
  },
};

// Dark mode story
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">{withSupabaseMock(Story, mockSocialLinks)}</div>
    ),
  ],
  args: {
    artist: mockArtist,
  },
};

// Loading state story
export const Loading: Story = {
  decorators: [
    (Story) => {
      // Save the original implementation
      const originalUseAuthenticatedSupabase =
        supabaseModule.useAuthenticatedSupabase;

      // Mock a loading state by returning a promise that never resolves
      // @ts-ignore - we're intentionally mocking this
      supabaseModule.useAuthenticatedSupabase = () => ({
        getAuthenticatedClient: () => ({
          from: () => ({
            select: () => ({
              eq: () => new Promise(() => {}), // Never resolves
            }),
          }),
        }),
        supabase: null,
      });

      // Render the story
      const result = <Story />;

      // Restore the original implementation after rendering
      // @ts-ignore - we're intentionally restoring this
      supabaseModule.useAuthenticatedSupabase =
        originalUseAuthenticatedSupabase;

      return result;
    },
  ],
  args: {
    artist: mockArtist,
  },
};

// Success message story
export const SuccessMessage: Story = {
  decorators: [
    (Story) => {
      // Save the original implementation
      const originalUseAuthenticatedSupabase =
        supabaseModule.useAuthenticatedSupabase;
      const originalUseState = React.useState;

      // Mock the Supabase client
      // @ts-ignore - we're intentionally mocking this
      supabaseModule.useAuthenticatedSupabase = () => ({
        getAuthenticatedClient: () => ({
          from: () => ({
            select: () => ({
              eq: () =>
                Promise.resolve({
                  data: mockSocialLinks,
                  error: null,
                }),
            }),
            delete: () => ({
              eq: () => Promise.resolve({ error: null }),
            }),
            insert: () => Promise.resolve({ error: null }),
          }),
        }),
        supabase: null,
      });

      // Mock useState to show success message
      let callCount = 0;
      // @ts-ignore - we're intentionally mocking this
      React.useState = (initialState: unknown) => {
        callCount++;
        if (callCount === 1) return [false, () => {}]; // loading
        if (callCount === 2) return [undefined, () => {}]; // error
        if (callCount === 3) return [true, () => {}]; // success
        if (callCount === 4) return [mockSocialLinks, () => {}]; // socialLinks
        return originalUseState(initialState);
      };

      // Render the story
      const result = <Story />;

      // Restore the original implementations after rendering
      // @ts-ignore - we're intentionally restoring this
      supabaseModule.useAuthenticatedSupabase =
        originalUseAuthenticatedSupabase;
      // @ts-ignore - we're intentionally restoring this
      React.useState = originalUseState;

      return result;
    },
  ],
  args: {
    artist: mockArtist,
  },
};