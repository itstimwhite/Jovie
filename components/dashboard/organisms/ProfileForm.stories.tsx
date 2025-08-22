import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm } from './ProfileForm';
import { userEvent, within } from '@storybook/testing-library';

// Mock the clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    has: jest.fn().mockImplementation(({ feature }) => {
      // Return true for remove_branding feature to show the toggle
      if (feature === 'remove_branding') return true;
      return false;
    }),
  }),
}));

// Mock the Supabase hook
jest.mock('@/lib/supabase', () => ({
  useAuthenticatedSupabase: () => ({
    getAuthenticatedClient: () => ({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({
                data: {
                  id: 'artist123',
                  display_name: 'Updated Artist Name',
                  bio: 'Updated tagline',
                  avatar_url: 'https://placekitten.com/300/300',
                },
                error: null,
              }),
            }),
          }),
        }),
      }),
    }),
  }),
}));

// Mock the feature flags
jest.mock('@/lib/env', () => ({
  flags: {
    feature_image_cdn_cloudinary: true,
  },
}));

const mockArtist = {
  id: 'artist123',
  name: 'Test Artist',
  tagline: 'Electronic music producer',
  image_url: 'https://placekitten.com/200/200',
  settings: {
    hide_branding: false,
  },
};

const meta: Meta<typeof ProfileForm> = {
  title: 'Dashboard/Organisms/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
  args: {
    artist: mockArtist,
    onUpdate: (artist) => console.log('Artist updated:', artist),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Pristine state
export const Pristine: Story = {};

// With different values
export const WithDifferentValues: Story = {
  args: {
    artist: {
      ...mockArtist,
      name: 'Different Artist',
      tagline: 'Hip hop artist and producer',
      image_url: 'https://placekitten.com/300/300',
    },
  },
};

// Without image
export const WithoutImage: Story = {
  args: {
    artist: {
      ...mockArtist,
      image_url: '',
    },
  },
};

// With branding hidden
export const WithBrandingHidden: Story = {
  args: {
    artist: {
      ...mockArtist,
      settings: {
        hide_branding: true,
      },
    },
  },
};

// Loading/submitting state
export const Submitting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Change the name field
    const nameInput = canvas.getByPlaceholderText('Your Artist Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Artist Name', { delay: 100 });
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /update profile/i });
    await userEvent.click(submitButton);
  },
};

// Success state
export const SuccessState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Change the name field
    const nameInput = canvas.getByPlaceholderText('Your Artist Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Artist Name', { delay: 100 });
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /update profile/i });
    await userEvent.click(submitButton);
    
    // Wait for success message
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};

