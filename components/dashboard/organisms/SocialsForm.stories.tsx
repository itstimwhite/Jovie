import type { Meta, StoryObj } from '@storybook/react';
import { SocialsForm } from './SocialsForm';
import { Artist } from '@/types/db';

// Create a mock artist for our stories
const mockArtist: Artist = {
  id: 'artist-123',
  owner_user_id: 'user-123',
  handle: 'artisthandle',
  spotify_id: 'spotify-123',
  name: 'Artist Name',
  image_url: 'https://placekitten.com/200/200',
  tagline: 'Artist tagline',
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
  },
  settings: {
    hide_branding: false,
  },
  spotify_url: 'https://spotify.com/artist/123',
  apple_music_url: 'https://music.apple.com/artist/123',
  youtube_url: 'https://youtube.com/channel/123',
  published: true,
  is_verified: true,
  is_featured: false,
  marketing_opt_out: false,
  created_at: '2023-01-01T00:00:00Z',
};

// Mock social links data for different scenarios
const mockSocialLinks = [
  { id: '1', platform: 'instagram', url: 'https://instagram.com/artist' },
  { id: '2', platform: 'twitter', url: 'https://twitter.com/artist' },
  { id: '3', platform: 'tiktok', url: 'https://tiktok.com/@artist' },
];

const meta: Meta<typeof SocialsForm> = {
  title: 'Dashboard/Organisms/SocialsForm',
  component: SocialsForm,
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
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    artist: {
      control: 'object',
      description: 'Artist data object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with no social links
export const Default: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: [] },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
      {
        url: '/api/social_links*',
        method: 'DELETE',
        status: 200,
        response: { success: true },
        delay: 200,
      },
    ],
  },
};

// Story with existing social links
export const WithExistingSocialLinks: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: mockSocialLinks },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
      {
        url: '/api/social_links*',
        method: 'DELETE',
        status: 200,
        response: { success: true },
        delay: 200,
      },
    ],
  },
};

// Story with loading state
export const Loading: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: [] },
        delay: 3000, // Long delay to show loading state
      },
    ],
  },
};

// Story with error state
export const WithError: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: mockSocialLinks },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 500,
        response: { error: 'Failed to save social links' },
        delay: 500,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    // Find the save button and click it to trigger error state
    const saveButton = canvasElement.querySelector(
      'button[type="button"]:not([class*="secondary"])'
    ) as HTMLButtonElement;
    if (saveButton && saveButton.textContent?.includes('Save')) {
      // Add a social link first
      const addButton = canvasElement.querySelector(
        'button[class*="secondary"]'
      ) as HTMLButtonElement;
      if (addButton && addButton.textContent?.includes('Add')) {
        addButton.click();
        // Wait a bit then click save to trigger error
        setTimeout(() => saveButton.click(), 500);
      }
    }
  },
};

// Story with success state
export const WithSuccess: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: [] },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    // Add a social link and save to show success state
    const addButton = canvasElement.querySelector(
      'button[class*="secondary"]'
    ) as HTMLButtonElement;
    if (addButton && addButton.textContent?.includes('Add')) {
      addButton.click();
      
      // Wait for the form to appear, then fill it and save
      setTimeout(() => {
        const urlInput = canvasElement.querySelector(
          'input[type="url"]'
        ) as HTMLInputElement;
        if (urlInput) {
          urlInput.value = 'https://instagram.com/artist';
          urlInput.dispatchEvent(new Event('input', { bubbles: true }));
          
          const saveButton = canvasElement.querySelector(
            'button:not([class*="secondary"])'
          ) as HTMLButtonElement;
          if (saveButton && saveButton.textContent?.includes('Save')) {
            saveButton.click();
          }
        }
      }, 300);
    }
  },
};

// Story with validation errors (empty URLs)
export const WithValidationErrors: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: [{ id: '1', platform: 'instagram', url: '' }] },
        delay: 300,
      },
    ],
  },
};

// Story with all platform options
export const AllPlatforms: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: {
          data: [
            { id: '1', platform: 'instagram', url: 'https://instagram.com/artist' },
            { id: '2', platform: 'twitter', url: 'https://twitter.com/artist' },
            { id: '3', platform: 'tiktok', url: 'https://tiktok.com/@artist' },
            { id: '4', platform: 'youtube', url: 'https://youtube.com/channel/artist' },
            { id: '5', platform: 'facebook', url: 'https://facebook.com/artist' },
            { id: '6', platform: 'linkedin', url: 'https://linkedin.com/in/artist' },
            { id: '7', platform: 'website', url: 'https://artist.com' },
          ],
        },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
    ],
  },
};

// Story with dark theme
export const DarkTheme: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: mockSocialLinks },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="dark max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

// Story with mobile viewport
export const MobileView: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: mockSocialLinks },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
    ],
  },
};

// Story with tablet viewport  
export const TabletView: Story = {
  args: {
    artist: mockArtist,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    mockData: [
      {
        url: '/api/social_links*',
        method: 'GET',
        status: 200,
        response: { data: mockSocialLinks },
        delay: 300,
      },
      {
        url: '/api/social_links*',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 500,
      },
    ],
  },
};